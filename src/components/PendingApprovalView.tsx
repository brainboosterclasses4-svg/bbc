import React from 'react';
import { Clock, ShieldCheck, Mail, LogOut, RefreshCw, CheckCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PendingApprovalView: React.FC = () => {
  const { profile, signOutUser, refreshProfile, setTestRoleOverride } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 sm:p-10 animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
          Registration Pending Approval
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 font-heading">
          Welcome to Brain Booster Classes, {profile?.fullName || 'Student'}!
        </h1>

        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          Your student registration request for <strong>{profile?.className || 'Class'}</strong> has been received by your teacher.
        </p>

        {/* Status card */}
        <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500">Student Name:</span>
            <span className="font-semibold text-slate-900">{profile?.fullName}</span>
          </div>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500">Registered Email:</span>
            <span className="font-semibold text-slate-900">{profile?.email}</span>
          </div>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500">Selected Class:</span>
            <span className="font-semibold text-blue-600">{profile?.className}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Current Status:</span>
            <span className="font-bold text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Under Teacher Verification
            </span>
          </div>
        </div>

        {/* Security & safety note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 max-w-md mx-auto flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-950">Student Safety & Access Control:</p>
            <p className="text-blue-800/90 mt-0.5">
              To protect student learning material and prevent unauthorized access, classroom recordings and Note3 PDF notes remain strictly locked until the lead teacher approves your account and assigns you to the official batch roster.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => refreshProfile()}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Approval Status</span>
          </button>

          <button
            onClick={() => signOutUser()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Fast test override helper */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">
            Testing on your laptop right now?
          </p>
          <button
            onClick={() => setTestRoleOverride('teacher')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Switch to Teacher Mode to approve this student →
          </button>
        </div>
      </div>
    </div>
  );
};
