import React from 'react';
import { X, Shield, Lock, EyeOff, UserCheck, Trash2 } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">Privacy Policy & Student Safety Guidelines</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-950">Brain Booster Classes Commitment to Student Privacy</p>
              <p className="text-blue-800 mt-0.5">
                We believe students study best when their learning data, submissions, contact details, and marks remain strictly confidential.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-slate-600" />
              1. What Student Information We Collect
            </h3>
            <p>
              We collect only the bare minimum data required to facilitate classes:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-1 text-slate-600">
              <li>Student Full Name (for attendance and homework grading)</li>
              <li>Email address (for authentication and password reset)</li>
              <li>Academic Class (Class 6 to Class 12, so students only see relevant syllabus)</li>
              <li>Optional Parent/Guardian name and emergency contact phone number</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-600" />
              2. Strict Isolation & No Public Directories
            </h3>
            <p>
              Students <strong>never</strong> see other students' contact numbers, email addresses, marks, or homework answers. There is no public chat room, unmoderated forum, or directory of student profiles.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-slate-600" />
              3. Data Retention & Account Deletion
            </h3>
            <p>
              Upon completing a course or whenever requested by a parent or student, the teacher can immediately delete or anonymize the student account and submissions from the Admin Dashboard, or by writing to <span className="font-mono text-slate-900">brainboosterclasses4@gmail.com</span>.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">4. Acceptable Portal Use</h3>
            <p>
              Class recordings and Note3 PDF notes are exclusively for enrolled students of Brain Booster Classes. Unauthorized reproduction or commercial redistribution outside the coaching portal is prohibited.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition"
          >
            Close Privacy Notice
          </button>
        </div>
      </div>
    </div>
  );
};
