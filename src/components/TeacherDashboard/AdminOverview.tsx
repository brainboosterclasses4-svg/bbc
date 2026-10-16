import React from 'react';
import {
  Users,
  Clock,
  Video,
  FileText,
  BookOpen,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, Recording, NoteItem, HomeworkItem, SubmissionItem, ClassItem } from '../../types';

interface AdminOverviewProps {
  students: UserProfile[];
  recordings: Recording[];
  notes: NoteItem[];
  homework: HomeworkItem[];
  submissions: SubmissionItem[];
  classes: ClassItem[];
  onNavigateTab: (tab: 'approvals' | 'recordings' | 'notes' | 'homework' | 'curriculum') => void;
  onOpenGuide: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  students,
  recordings,
  notes,
  homework,
  submissions,
  classes,
  onNavigateTab,
  onOpenGuide,
}) => {
  const approvedStudents = students.filter(s => s.status === 'approved');
  const pendingStudents = students.filter(s => s.status === 'pending');
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Quick Launch Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-100 backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Brain Booster Classes • Master Faculty Control</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
            Teacher & Admin Command Center
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Manage your coaching classes, publish OBS class lectures, upload Note3 PDF formula sheets, evaluate student homework submissions, and approve admissions with full privacy control.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('recordings')}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish OBS Video</span>
            </button>
            <button
              onClick={() => onNavigateTab('notes')}
              className="px-4 py-2 bg-blue-500/30 hover:bg-blue-500/40 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note3 PDF</span>
            </button>
            <button
              onClick={() => onNavigateTab('homework')}
              className="px-4 py-2 bg-blue-500/30 hover:bg-blue-500/40 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Homework</span>
            </button>
            <button
              onClick={onOpenGuide}
              className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Dell Laptop & Free Tiers Guide</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved Students */}
        <div
          onClick={() => onNavigateTab('approvals')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{approvedStudents.length}</span>
            <span className="text-xs text-emerald-600 font-bold">Active Roster</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Spread across Class 6–12</p>
        </div>

        {/* Pending Approvals */}
        <div
          onClick={() => onNavigateTab('approvals')}
          className={`bg-white p-5 rounded-2xl border shadow-xs hover:shadow-md transition cursor-pointer group ${
            pendingStudents.length > 0 ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{pendingStudents.length}</span>
            <span className="text-xs text-amber-700 font-bold">Require Review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending student signups</p>
        </div>

        {/* OBS Recordings */}
        <div
          onClick={() => onNavigateTab('recordings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">OBS Recorded Lectures</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{recordings.length}</span>
            <span className="text-xs text-purple-600 font-bold">Published</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero-cost streaming</p>
        </div>

        {/* Homework Submissions to review */}
        <div
          onClick={() => onNavigateTab('homework')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Homework Submissions</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{submissions.length}</span>
            {pendingSubmissions.length > 0 ? (
              <span className="text-xs text-amber-600 font-bold">{pendingSubmissions.length} To Grade</span>
            ) : (
              <span className="text-xs text-emerald-600 font-bold">All Graded</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{homework.length} active assignments</p>
        </div>
      </div>

      {/* Class-wise distribution cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Batch & Class Overview (Class 6 to Class 12)</h3>
            <p className="text-xs text-slate-500">Resource distribution and enrolled student strength</p>
          </div>
          <button
            onClick={() => onNavigateTab('curriculum')}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>Manage Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {classes.map(cls => {
            const classStudents = approvedStudents.filter(s => s.classId === cls.id).length;
            const classRecs = recordings.filter(r => r.classId === cls.id).length;
            const classNotes = notes.filter(n => n.classId === cls.id).length;

            return (
              <div
                key={cls.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition text-center space-y-1.5"
              >
                <div className="text-xs font-bold text-slate-900">{cls.name}</div>
                <div className="text-xl font-extrabold text-blue-600">{classStudents}</div>
                <div className="text-[10px] font-medium text-slate-500">Students</div>
                <div className="pt-2 border-t border-slate-200/60 flex justify-center gap-2 text-[10px] text-slate-400">
                  <span>{classRecs} vids</span>
                  <span>•</span>
                  <span>{classNotes} notes</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
