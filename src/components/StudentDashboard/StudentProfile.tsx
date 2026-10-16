import React, { useState } from 'react';
import { User, Mail, GraduationCap, Phone, ShieldCheck, Save, CheckCircle, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface StudentProfileProps {
  profile: UserProfile;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ profile }) => {
  const { updateStudentProfile, signOutUser } = useAuth();
  const [parentName, setParentName] = useState(profile.parentName || '');
  const [parentPhone, setParentPhone] = useState(profile.parentPhone || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudentProfile({
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Enrolled
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                <GraduationCap className="w-4 h-4" />
                <span>Assigned to {profile.className}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOutUser()}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Edit Permitted Contact Info Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Student & Emergency Contact Info</h3>
            {saveSuccess && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Student Phone / WhatsApp (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name (Optional)</label>
              <input
                type="text"
                value={parentName}
                onChange={e => setParentName(e.target.value)}
                placeholder="Parent Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parent Contact Number (Optional)</label>
              <input
                type="tel"
                value={parentPhone}
                onChange={e => setParentPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Your contact info is strictly confidential and visible only to your lead teacher. Other students never see your details or contact numbers.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Contact Info'}</span>
            </button>
          </div>
        </form>

        {/* Change Class Inquiry Notice */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p>
            Need to change your assigned class or batch? Please request your teacher or email <span className="text-blue-600 font-mono">brainboosterclasses4@gmail.com</span>. Class reassignments are managed by the coaching administration.
          </p>
        </div>
      </div>
    </div>
  );
};
