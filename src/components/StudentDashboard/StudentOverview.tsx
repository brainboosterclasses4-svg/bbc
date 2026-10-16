import React from 'react';
import {
  GraduationCap,
  Video,
  FileText,
  BookOpen,
  Clock,
  Award,
  Play,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { UserProfile, Recording, NoteItem, HomeworkItem, SubmissionItem, SubjectItem } from '../../types';

interface StudentOverviewProps {
  profile: UserProfile;
  recordings: Recording[];
  notes: NoteItem[];
  homework: HomeworkItem[];
  submissions: SubmissionItem[];
  subjects: SubjectItem[];
  onNavigateTab: (tab: 'recordings' | 'notes' | 'homework' | 'profile') => void;
  onPreviewRecording: (rec: Recording) => void;
  onPreviewNote: (note: NoteItem) => void;
  onOpenSubmitHomework: (hw: HomeworkItem) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  profile,
  recordings,
  notes,
  homework,
  submissions,
  subjects,
  onNavigateTab,
  onPreviewRecording,
  onPreviewNote,
  onOpenSubmitHomework,
}) => {
  // Homework that the student hasn't submitted yet
  const unsubmittedHw = homework.filter(
    h => !submissions.some(s => s.homeworkId === h.id)
  );

  // Reviewed submissions with marks
  const reviewedSubmissions = submissions.filter(
    s => (s.status === 'reviewed' || s.status === 'returned') && s.marks !== undefined
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-100 backdrop-blur-xs border border-white/10">
            <GraduationCap className="w-4 h-4 text-yellow-300" />
            <span>Brain Booster Classes • Student Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
            Welcome back, {profile.fullName}!
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            You are enrolled in <strong className="text-yellow-300 font-bold">{profile.className}</strong>.
            Access your class recorded lectures, Note3 handwritten revision notes, and submit homework on time.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('recordings')}
              className="px-4 py-2 bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-blue-600" />
              <span>Watch Class Recordings</span>
            </button>
            <button
              onClick={() => onNavigateTab('notes')}
              className="px-4 py-2 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-blue-200" />
              <span>Read Note3 PDFs</span>
            </button>
            <button
              onClick={() => onNavigateTab('homework')}
              className="px-4 py-2 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-blue-200" />
              <span>Submit Homework ({unsubmittedHw.length} Pending)</span>
            </button>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none hidden sm:block">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('recordings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Class Lectures</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{recordings.length}</span>
            <span className="text-xs text-blue-600 font-bold ml-1.5">Videos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Recorded via OBS Studio</p>
        </div>

        <div
          onClick={() => onNavigateTab('notes')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">PDF Study Notes</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{notes.length}</span>
            <span className="text-xs text-emerald-600 font-bold ml-1.5">PDFs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Handwritten Note3 sheets</p>
        </div>

        <div
          onClick={() => onNavigateTab('homework')}
          className={`bg-white p-5 rounded-2xl border shadow-xs hover:border-blue-300 transition cursor-pointer group ${
            unsubmittedHw.length > 0 ? 'border-amber-300' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{unsubmittedHw.length}</span>
            <span className="text-xs text-slate-500 font-bold ml-1.5">Due</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Submit before deadline</p>
        </div>

        <div
          onClick={() => onNavigateTab('homework')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Graded Work</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-700">{reviewedSubmissions.length}</span>
            <span className="text-xs text-purple-600 font-bold ml-1.5">Reviewed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Teacher feedback available</p>
        </div>
      </div>

      {/* Pending Homework Alert Section */}
      {unsubmittedHw.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-950">
                Action Required: {unsubmittedHw.length} Pending Homework Assignment{unsubmittedHw.length > 1 ? 's' : ''}
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('homework')}
              className="text-xs font-bold text-amber-800 hover:underline"
            >
              View All Tasks →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unsubmittedHw.slice(0, 2).map(hw => (
              <div
                key={hw.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-blue-600">{hw.subjectName}</span>
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {new Date(hw.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{hw.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{hw.instructions}</p>
                </div>

                <button
                  onClick={() => onOpenSubmitHomework(hw)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Submit Solution
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Lectures & Recent Notes 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Class Lectures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent OBS Recorded Lectures</h3>
            </div>
            <button
              onClick={() => onNavigateTab('recordings')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Browse All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recordings.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No recordings published for {profile.className} yet.</p>
          ) : (
            <div className="space-y-3">
              {recordings.slice(0, 3).map(rec => (
                <div
                  key={rec.id}
                  onClick={() => onPreviewRecording(rec)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-16 h-12 bg-slate-900 rounded-lg overflow-hidden shrink-0 relative">
                    <img
                      src={rec.thumbnailUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'}
                      alt={rec.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                      {rec.subjectName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                      {rec.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{rec.chapterTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Study Materials & Note3 PDFs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Note3 PDF Notes & Formula Sheets</h3>
            </div>
            <button
              onClick={() => onNavigateTab('notes')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Browse All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No PDF study materials published for {profile.className} yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.slice(0, 3).map(note => (
                <div
                  key={note.id}
                  onClick={() => onPreviewNote(note)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                        {note.subjectName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">
                        {note.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{note.chapterTitle}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {note.fileSize || 'PDF'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
