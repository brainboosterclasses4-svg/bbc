import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isTeacher: boolean;
  isPending: boolean;
  isApproved: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerStudent: (data: {
    email: string;
    pass: string;
    fullName: string;
    classId: string;
    className: string;
    parentName?: string;
    parentPhone?: string;
    phoneNumber?: string;
  }) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateStudentProfile: (data: Partial<UserProfile>) => Promise<void>;
  testRoleOverride: 'teacher' | 'approved-student' | 'pending-student' | null;
  setTestRoleOverride: (role: 'teacher' | 'approved-student' | 'pending-student' | null) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROOT_ADMIN_EMAIL = 'brainboosterclasses4@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [testRoleOverride, setTestRoleOverride] = useState<'teacher' | 'approved-student' | 'pending-student' | null>(null);

  const fetchUserProfile = async (user: User): Promise<UserProfile | null> => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }

      // Check if user is root admin
      const isRootAdmin = user.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();

      // Create initial profile if missing
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        fullName: user.displayName || (isRootAdmin ? 'Lead Teacher / Admin' : 'Student'),
        role: isRootAdmin ? 'admin' : 'student',
        classId: isRootAdmin ? 'all' : 'class-10',
        className: isRootAdmin ? 'All Classes (Faculty)' : 'Class 10',
        status: isRootAdmin ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, newProfile);

      // If root admin, also ensure presence in /admins collection
      if (isRootAdmin) {
        try {
          await setDoc(doc(db, 'admins', user.uid), {
            email: user.email,
            role: 'super_admin',
            createdAt: new Date().toISOString(),
          });
        } catch {
          // Ignore if admin record already exists
        }
      }

      return newProfile;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const p = await fetchUserProfile(currentUser);
      setProfile(p);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userProf = await fetchUserProfile(user);
          setProfile(userProf);
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const userProf = await fetchUserProfile(result.user);
        setProfile(userProf);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        const userProf = await fetchUserProfile(result.user);
        setProfile(userProf);
      }
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (data: {
    email: string;
    pass: string;
    fullName: string;
    classId: string;
    className: string;
    parentName?: string;
    parentPhone?: string;
    phoneNumber?: string;
  }) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      const isRootAdmin = data.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: data.email,
        fullName: data.fullName,
        role: isRootAdmin ? 'admin' : 'student',
        classId: data.classId,
        className: data.className,
        status: isRootAdmin ? 'approved' : 'pending',
        parentName: data.parentName || '',
        parentPhone: data.parentPhone || '',
        phoneNumber: data.phoneNumber || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setProfile(newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'users');
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setProfile(null);
      setTestRoleOverride(null);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(doc(db, 'users', currentUser.uid), updateData);
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  // Compute active effective role & status factoring in test overrides
  let activeRole: 'teacher' | 'student' | 'pending' = 'student';
  let isTeacher = false;
  let isPending = false;
  let isApproved = false;

  if (testRoleOverride === 'teacher') {
    isTeacher = true;
    isApproved = true;
    activeRole = 'teacher';
  } else if (testRoleOverride === 'pending-student') {
    isTeacher = false;
    isPending = true;
    isApproved = false;
    activeRole = 'pending';
  } else if (testRoleOverride === 'approved-student') {
    isTeacher = false;
    isPending = false;
    isApproved = true;
    activeRole = 'student';
  } else if (profile) {
    if (profile.role === 'admin' || profile.role === 'teacher' || currentUser?.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) {
      isTeacher = true;
      isApproved = true;
      activeRole = 'teacher';
    } else if (profile.status === 'pending') {
      isPending = true;
      activeRole = 'pending';
    } else if (profile.status === 'approved') {
      isApproved = true;
      activeRole = 'student';
    }
  }

  // Active mock/override profile for testing if override is enabled
  const effectiveProfile: UserProfile | null = testRoleOverride
    ? {
        uid: currentUser?.uid || 'test-user-id',
        email: testRoleOverride === 'teacher' ? ROOT_ADMIN_EMAIL : (currentUser?.email || 'student.sample@gmail.com'),
        fullName: testRoleOverride === 'teacher' ? 'Prof. Sharma (Teacher Demo)' : (testRoleOverride === 'pending-student' ? 'Aarav Patel (Pending Registration)' : 'Priya Verma (Approved Student)'),
        role: testRoleOverride === 'teacher' ? 'admin' : 'student',
        classId: testRoleOverride === 'teacher' ? 'all' : 'class-10',
        className: testRoleOverride === 'teacher' ? 'All Classes (Faculty)' : 'Class 10',
        status: testRoleOverride === 'pending-student' ? 'pending' : 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    : profile;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile: effectiveProfile,
        loading,
        isTeacher,
        isPending,
        isApproved,
        signInWithGoogle,
        signInWithEmail,
        registerStudent,
        signOutUser,
        updateStudentProfile,
        testRoleOverride,
        setTestRoleOverride,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
