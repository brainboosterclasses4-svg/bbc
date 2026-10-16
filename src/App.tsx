import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { PrivacyTermsModal } from './components/PrivacyTermsModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { PendingApprovalView } from './components/PendingApprovalView';

// Teacher Dashboard Components
import { AdminOverview } from './components/TeacherDashboard/AdminOverview';
import { StudentApprovals } from './components/TeacherDashboard/StudentApprovals';
import { RecordingsManager } from './components/TeacherDashboard/RecordingsManager';
import { NotesManager } from './components/TeacherDashboard/NotesManager';
import { HomeworkManager } from './components/TeacherDashboard/HomeworkManager';
import { ClassSubjectManager } from './components/TeacherDashboard/ClassSubjectManager';

// Student Dashboard Components
import { StudentOverview } from './components/StudentDashboard/StudentOverview';
import { StudentRecordings } from './components/StudentDashboard/StudentRecordings';
import { StudentNotes } from './components/StudentDashboard/StudentNotes';
import { StudentHomework } from './components/StudentDashboard/StudentHomework';
import { StudentProfile } from './components/StudentDashboard/StudentProfile';

import {
  UserProfile,
  ClassItem,
  SubjectItem,
  Recording,
  NoteItem,
  HomeworkItem,
  SubmissionItem,
} from './types';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_RECORDINGS,
  INITIAL_NOTES,
  INITIAL_HOMEWORK,
} from './lib/sampleData';
import {
  GraduationCap,
  Video,
  FileText,
  BookOpen,
  Users,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Play,
  HelpCircle,
} from 'lucide-react';

const MainPortal: React.FC = () => {
  const { currentUser, profile, isTeacher, isPending, isApproved, loading: authLoading } = useAuth();

  // Navigation state
  const [teacherTab, setTeacherTab] = useState<'overview' | 'approvals' | 'recordings' | 'notes' | 'homework' | 'curriculum'>('overview');
  const [studentTab, setStudentTab] = useState<'overview' | 'recordings' | 'notes' | 'homework' | 'profile'>('overview');

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'register'>('signin');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<Recording | null>(null);
  const [activePdfModal, setActivePdfModal] = useState<NoteItem | null>(null);
  const [activeHwToSubmit, setActiveHwToSubmit] = useState<HomeworkItem | null>(null);

  // Data Collections state (populated with real Firebase listeners + fallback sample defaults)
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [recordings, setRecordings] = useState<Recording[]>(INITIAL_RECORDINGS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [homework, setHomework] = useState<HomeworkItem[]>(INITIAL_HOMEWORK);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);

  // Seed default academic structure and sample resources to Firestore
  const seedFirestoreDatabase = async () => {
    try {
      for (const cls of INITIAL_CLASSES) {
        await setDoc(doc(db, 'classes', cls.id), cls);
      }
      for (const sub of INITIAL_SUBJECTS) {
        await setDoc(doc(db, 'subjects', sub.id), sub);
      }
      for (const rec of INITIAL_RECORDINGS) {
        await setDoc(doc(db, 'recordings', rec.id), rec);
      }
      for (const note of INITIAL_NOTES) {
        await setDoc(doc(db, 'notes', note.id), note);
      }
      for (const hw of INITIAL_HOMEWORK) {
        await setDoc(doc(db, 'homework', hw.id), hw);
      }
      alert('Default syllabus, OBS sample recordings, Note3 PDF notes, and homework successfully loaded!');
    } catch (err) {
      console.error('Seeding error:', err);
      alert('Seeding initiated. If rules require admin login, please sign in with brainboosterclasses4@gmail.com.');
    }
  };

  // Firestore Real-Time Listeners (only attach when auth is checked)
  useEffect(() => {
    if (authLoading) return;

    // Listen to classes
    const unsubClasses = onSnapshot(
      collection(db, 'classes'),
      snap => {
        if (!snap.empty) {
          const list: ClassItem[] = [];
          snap.forEach(d => list.push(d.data() as ClassItem));
          list.sort((a, b) => a.order - b.order);
          setClasses(list);
        }
      },
      error => {
        console.warn('Classes listener warning:', error.message);
      }
    );

    // Listen to subjects
    const unsubSubjects = onSnapshot(
      collection(db, 'subjects'),
      snap => {
        if (!snap.empty) {
          const list: SubjectItem[] = [];
          snap.forEach(d => list.push(d.data() as SubjectItem));
          setSubjects(list);
        }
      },
      error => {
        console.warn('Subjects listener warning:', error.message);
      }
    );

    // Listen to recordings
    const unsubRecordings = onSnapshot(
      collection(db, 'recordings'),
      snap => {
        if (!snap.empty) {
          const list: Recording[] = [];
          snap.forEach(d => list.push(d.data() as Recording));
          setRecordings(list);
        }
      },
      error => {
        console.warn('Recordings listener warning:', error.message);
      }
    );

    // Listen to notes
    const unsubNotes = onSnapshot(
      collection(db, 'notes'),
      snap => {
        if (!snap.empty) {
          const list: NoteItem[] = [];
          snap.forEach(d => list.push(d.data() as NoteItem));
          setNotes(list);
        }
      },
      error => {
        console.warn('Notes listener warning:', error.message);
      }
    );

    // Listen to homework
    const unsubHomework = onSnapshot(
      collection(db, 'homework'),
      snap => {
        if (!snap.empty) {
          const list: HomeworkItem[] = [];
          snap.forEach(d => list.push(d.data() as HomeworkItem));
          setHomework(list);
        }
      },
      error => {
        console.warn('Homework listener warning:', error.message);
      }
    );

    // Listen to submissions
    const unsubSubmissions = onSnapshot(
      collection(db, 'submissions'),
      snap => {
        const list: SubmissionItem[] = [];
        snap.forEach(d => list.push(d.data() as SubmissionItem));
        setSubmissions(list);
      },
      error => {
        console.warn('Submissions listener warning:', error.message);
      }
    );

    // If teacher, also listen to all users
    let unsubUsers = () => {};
    if (isTeacher) {
      unsubUsers = onSnapshot(
        collection(db, 'users'),
        snap => {
          const list: UserProfile[] = [];
          snap.forEach(d => list.push(d.data() as UserProfile));
          setAllStudents(list);
        },
        error => {
          console.warn('Users listener warning:', error.message);
        }
      );
    }

    return () => {
      unsubClasses();
      unsubSubjects();
      unsubRecordings();
      unsubNotes();
      unsubHomework();
      unsubSubmissions();
      unsubUsers();
    };
  }, [authLoading, isTeacher]);

  // Seed sample data if collections are freshly provisioned
  useEffect(() => {
    const checkFreshAndSeed = async () => {
      if (isTeacher && currentUser) {
        try {
          const snap = await getDocs(collection(db, 'classes'));
          if (snap.empty) {
            await seedFirestoreDatabase();
          }
        } catch {
          // Handled
        }
      }
    };
    checkFreshAndSeed();
  }, [isTeacher, currentUser]);

  // Teacher Handlers
  const handleApproveStudent = async (studentId: string, classId: string, className: string) => {
    try {
      const studentRef = doc(db, 'users', studentId);
      await updateDoc(studentRef, {
        status: 'approved',
        classId,
        className,
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser?.uid || 'admin',
      });
      // Also update local list for instant feedback
      setAllStudents(prev =>
        prev.map(s => (s.uid === studentId ? { ...s, status: 'approved', classId, className } : s))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${studentId}`);
    }
  };

  const handleRejectStudent = async (studentId: string) => {
    try {
      await updateDoc(doc(db, 'users', studentId), {
        status: 'rejected',
        updatedAt: new Date().toISOString(),
      });
      setAllStudents(prev =>
        prev.map(s => (s.uid === studentId ? { ...s, status: 'rejected' } : s))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${studentId}`);
    }
  };

  const handleUpdateStudentClass = async (studentId: string, classId: string, className: string) => {
    try {
      await updateDoc(doc(db, 'users', studentId), {
        classId,
        className,
        updatedAt: new Date().toISOString(),
      });
      setAllStudents(prev =>
        prev.map(s => (s.uid === studentId ? { ...s, classId, className } : s))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${studentId}`);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteDoc(doc(db, 'users', studentId));
      setAllStudents(prev => prev.filter(s => s.uid !== studentId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${studentId}`);
    }
  };

  const handleSaveRecording = async (recData: Partial<Recording>) => {
    try {
      const recId = recData.id || `rec-${Date.now()}`;
      const fullRec: Recording = {
        id: recId,
        title: recData.title || '',
        classId: recData.classId || 'class-10',
        subjectId: recData.subjectId || '',
        subjectName: recData.subjectName || 'General',
        chapterTitle: recData.chapterTitle || 'Chapter',
        lessonDate: recData.lessonDate || new Date().toISOString().split('T')[0],
        description: recData.description || '',
        videoUrl: recData.videoUrl || '',
        thumbnailUrl: recData.thumbnailUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        duration: recData.duration || '45 mins',
        status: recData.status || 'published',
        authorId: currentUser?.uid || 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'recordings', recId), fullRec);
      setRecordings(prev => {
        const idx = prev.findIndex(r => r.id === recId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = fullRec;
          return updated;
        }
        return [fullRec, ...prev];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'recordings');
    }
  };

  const handleDeleteRecording = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recordings', id));
      setRecordings(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `recordings/${id}`);
    }
  };

  const handleSaveNote = async (noteData: Partial<NoteItem>) => {
    try {
      const noteId = noteData.id || `note-${Date.now()}`;
      const fullNote: NoteItem = {
        id: noteId,
        title: noteData.title || '',
        classId: noteData.classId || 'class-10',
        subjectId: noteData.subjectId || '',
        subjectName: noteData.subjectName || 'General',
        chapterTitle: noteData.chapterTitle || 'Chapter',
        description: noteData.description || '',
        fileUrl: noteData.fileUrl || '',
        fileSize: noteData.fileSize || '2.5 MB',
        status: noteData.status || 'published',
        authorId: currentUser?.uid || 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'notes', noteId), fullNote);
      setNotes(prev => {
        const idx = prev.findIndex(n => n.id === noteId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = fullNote;
          return updated;
        }
        return [fullNote, ...prev];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'notes');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `notes/${id}`);
    }
  };

  const handleSaveHomework = async (hwData: Partial<HomeworkItem>) => {
    try {
      const hwId = hwData.id || `hw-${Date.now()}`;
      const fullHw: HomeworkItem = {
        id: hwId,
        title: hwData.title || '',
        classId: hwData.classId || 'class-10',
        subjectId: hwData.subjectId || '',
        subjectName: hwData.subjectName || 'General',
        chapterTitle: hwData.chapterTitle || 'Practice Worksheet',
        instructions: hwData.instructions || '',
        attachmentUrl: hwData.attachmentUrl || '',
        dueDate: hwData.dueDate || new Date().toISOString(),
        totalMarks: hwData.totalMarks || 25,
        status: hwData.status || 'published',
        authorId: currentUser?.uid || 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'homework', hwId), fullHw);
      setHomework(prev => {
        const idx = prev.findIndex(h => h.id === hwId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = fullHw;
          return updated;
        }
        return [fullHw, ...prev];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'homework');
    }
  };

  const handleDeleteHomework = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'homework', id));
      setHomework(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `homework/${id}`);
    }
  };

  const handleGradeSubmission = async (
    submissionId: string,
    marks: number,
    feedback: string,
    status: 'reviewed' | 'returned'
  ) => {
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        marks,
        feedback,
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: currentUser?.uid || 'admin',
      });
      setSubmissions(prev =>
        prev.map(s => (s.id === submissionId ? { ...s, marks, feedback, status } : s))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `submissions/${submissionId}`);
    }
  };

  const handleAddSubject = async (classId: string, name: string, color: string) => {
    try {
      const subId = `sub-${classId}-${Date.now()}`;
      const newSub: SubjectItem = {
        id: subId,
        classId,
        name,
        color: color || 'blue',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'subjects', subId), newSub);
      setSubjects(prev => [...prev, newSub]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'subjects');
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await deleteDoc(doc(db, 'subjects', subjectId));
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `subjects/${subjectId}`);
    }
  };

  const handleAddClass = async (name: string, description: string) => {
    try {
      const classId = `class-${Date.now()}`;
      const newCls: ClassItem = {
        id: classId,
        name,
        order: classes.length + 1,
        description,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'classes', classId), newCls);
      setClasses(prev => [...prev, newCls]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'classes');
    }
  };

  // Student Handlers
  const handleSubmitHomework = async (
    homeworkId: string,
    homeworkTitle: string,
    answerText: string,
    attachmentUrl?: string
  ) => {
    const studentUid = currentUser?.uid || 'demo-student';
    const subId = `sub_${homeworkId}_${studentUid}`;
    try {
      const newSub: SubmissionItem = {
        id: subId,
        homeworkId,
        homeworkTitle,
        classId: profile?.classId || 'class-10',
        studentId: studentUid,
        studentName: profile?.fullName || 'Student',
        studentEmail: profile?.email || '',
        answerText,
        attachmentUrl: attachmentUrl || '',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'submissions', subId), newSub);
      setSubmissions(prev => {
        const idx = prev.findIndex(s => s.id === subId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = newSub;
          return updated;
        }
        return [...prev, newSub];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `submissions/${subId}`);
    }
  };

  // Filter materials for current student's assigned class
  const studentClassId = profile?.classId || 'class-10';
  const studentRecordings = recordings.filter(r => r.classId === studentClassId && r.status === 'published');
  const studentNotes = notes.filter(n => n.classId === studentClassId && n.status === 'published');
  const studentHomework = homework.filter(h => h.classId === studentClassId && h.status === 'published');
  const studentClassSubjects = subjects.filter(s => s.classId === studentClassId);
  const mySubmissions = submissions.filter(s => s.studentId === (currentUser?.uid || 'demo-student') || s.studentId === 'demo-student');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        onOpenAuth={() => {
          setAuthInitialMode('signin');
          setIsAuthModalOpen(true);
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1">
        {/* State A: User is NOT signed in -> Show Hero Homepage with Sign In / Register Actions */}
        {!currentUser && !profile && (
          <div className="space-y-16 py-8 sm:py-12">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-3xl space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-yellow-300 backdrop-blur-md border border-white/15">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Premier Coaching Portal for Class 6 to 12</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
                    Brain Booster Classes
                  </h1>

                  <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
                    A dedicated, secure digital learning portal. Watch live OBS classroom recordings, study from handwritten Note3 formula sheets, submit homework, and receive personalized marks and feedback from your teachers.
                  </p>

                  <div className="pt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setAuthInitialMode('register');
                        setIsAuthModalOpen(true);
                      }}
                      className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-2xl shadow-lg shadow-yellow-500/20 text-xs sm:text-sm transition flex items-center gap-2"
                    >
                      <span>New Student Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setAuthInitialMode('signin');
                        setIsAuthModalOpen(true);
                      }}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 text-xs sm:text-sm backdrop-blur-md transition flex items-center gap-2"
                    >
                      <span>Student / Faculty Login</span>
                    </button>

                    <button
                      onClick={() => setIsGuideOpen(true)}
                      className="px-4 py-3.5 bg-blue-700/50 hover:bg-blue-700/70 text-blue-100 font-semibold rounded-2xl border border-blue-500/30 text-xs transition flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-yellow-300" />
                      <span>Dell Laptop & Free Tiers Guide</span>
                    </button>
                  </div>
                </div>

                <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              </div>
            </section>

            {/* Feature Pillars */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Academic Highlights
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  Designed Specifically for Brain Booster Classes
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Zero distractions, no ads, strict class isolation, and 100% free hosting.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">OBS Classroom Recordings</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Recorded live with OBS Studio. Uploaded as YouTube Unlisted videos for zero streaming costs and embedded safely inside the student portal.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Note3 PDF Study Notes</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Digital handwritten notes exported directly from Note3. Clean formula mind maps, derivations, and solved NCERT/board questions with built-in PDF reader.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Homework & Review</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Class-wise practice worksheets. Students turn in written solutions or Google Drive links; teachers award marks and write feedback.
                  </p>
                </div>
              </div>
            </section>

            {/* Academic Batches Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-100/70 border border-slate-200 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">
                  Classes Supported at Brain Booster Classes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {classes.map(c => (
                    <div
                      key={c.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:border-blue-400 transition"
                    >
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-blue-600 font-semibold mt-1">Full Syllabus</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* State B: User is Authenticated but PENDING approval */}
        {currentUser && isPending && <PendingApprovalView />}

        {/* State C: User is Authenticated & is TEACHER / ADMIN */}
        {currentUser && isTeacher && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Teacher Dashboard Sub-Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
              {[
                { id: 'overview', label: 'Overview', icon: Sparkles },
                {
                  id: 'approvals',
                  label: `Student Approvals (${allStudents.filter(s => s.status === 'pending').length})`,
                  icon: Users,
                },
                { id: 'recordings', label: `OBS Recordings (${recordings.length})`, icon: Video },
                { id: 'notes', label: `Note3 PDF Notes (${notes.length})`, icon: FileText },
                { id: 'homework', label: `Homework & Reviews (${homework.length})`, icon: BookOpen },
                { id: 'curriculum', label: 'Class & Subjects', icon: Layers },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = teacherTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTeacherTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Teacher Active Tab Content */}
            {teacherTab === 'overview' && (
              <AdminOverview
                students={allStudents}
                recordings={recordings}
                notes={notes}
                homework={homework}
                submissions={submissions}
                classes={classes}
                onNavigateTab={(t: any) => setTeacherTab(t)}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
            )}

            {teacherTab === 'approvals' && (
              <StudentApprovals
                students={allStudents}
                classes={classes}
                onApprove={handleApproveStudent}
                onReject={handleRejectStudent}
                onUpdateStudentClass={handleUpdateStudentClass}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {teacherTab === 'recordings' && (
              <RecordingsManager
                recordings={recordings}
                classes={classes}
                subjects={subjects}
                onSaveRecording={handleSaveRecording}
                onDeleteRecording={handleDeleteRecording}
                onPreview={(r) => setActiveVideoModal(r)}
              />
            )}

            {teacherTab === 'notes' && (
              <NotesManager
                notes={notes}
                classes={classes}
                subjects={subjects}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
                onPreview={(n) => setActivePdfModal(n)}
              />
            )}

            {teacherTab === 'homework' && (
              <HomeworkManager
                homework={homework}
                submissions={submissions}
                classes={classes}
                subjects={subjects}
                onSaveHomework={handleSaveHomework}
                onDeleteHomework={handleDeleteHomework}
                onGradeSubmission={handleGradeSubmission}
              />
            )}

            {teacherTab === 'curriculum' && (
              <ClassSubjectManager
                classes={classes}
                subjects={subjects}
                onAddSubject={handleAddSubject}
                onDeleteSubject={handleDeleteSubject}
                onAddClass={handleAddClass}
                onSeedData={seedFirestoreDatabase}
              />
            )}
          </div>
        )}

        {/* State D: User is Authenticated & is APPROVED STUDENT */}
        {currentUser && isApproved && !isTeacher && profile && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Student Navigation Bar */}
            <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
              {[
                { id: 'overview', label: 'My Dashboard', icon: Sparkles },
                { id: 'recordings', label: `OBS Recordings (${studentRecordings.length})`, icon: Video },
                { id: 'notes', label: `Note3 PDF Notes (${studentNotes.length})`, icon: FileText },
                { id: 'homework', label: `Homework Tasks (${studentHomework.length})`, icon: BookOpen },
                { id: 'profile', label: 'My Profile', icon: Users },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = studentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStudentTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Student Active Tab Content */}
            {studentTab === 'overview' && (
              <StudentOverview
                profile={profile}
                recordings={studentRecordings}
                notes={studentNotes}
                homework={studentHomework}
                submissions={mySubmissions}
                subjects={studentClassSubjects}
                onNavigateTab={(t: any) => setStudentTab(t)}
                onPreviewRecording={(r) => setActiveVideoModal(r)}
                onPreviewNote={(n) => setActivePdfModal(n)}
                onOpenSubmitHomework={(hw) => {
                  setActiveHwToSubmit(hw);
                  setStudentTab('homework');
                }}
              />
            )}

            {studentTab === 'recordings' && (
              <StudentRecordings
                recordings={studentRecordings}
                subjects={studentClassSubjects}
                onPlayRecording={(r) => setActiveVideoModal(r)}
                className={profile.className}
              />
            )}

            {studentTab === 'notes' && (
              <StudentNotes
                notes={studentNotes}
                subjects={studentClassSubjects}
                onOpenPdf={(n) => setActivePdfModal(n)}
                className={profile.className}
              />
            )}

            {studentTab === 'homework' && (
              <StudentHomework
                homework={studentHomework}
                submissions={mySubmissions}
                subjects={studentClassSubjects}
                className={profile.className}
                onSubmitHomework={handleSubmitHomework}
                preselectedHw={activeHwToSubmit}
              />
            )}

            {studentTab === 'profile' && <StudentProfile profile={profile} />}
          </div>
        )}
      </main>

      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
      />

      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <PrivacyTermsModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <VideoPlayerModal
        recording={activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
      />

      <PdfViewerModal
        note={activePdfModal}
        onClose={() => setActivePdfModal(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainPortal />
    </AuthProvider>
  );
}
