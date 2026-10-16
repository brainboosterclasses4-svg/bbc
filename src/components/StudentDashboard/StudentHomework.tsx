import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  Award,
  Send,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { HomeworkItem, SubmissionItem, SubjectItem } from '../../types';

interface StudentHomeworkProps {
  homework: HomeworkItem[];
  submissions: SubmissionItem[];
  subjects: SubjectItem[];
  className: string;
  onSubmitHomework: (
    homeworkId: string,
    homeworkTitle: string,
    answerText: string,
    attachmentUrl?: string
  ) => Promise<void>;
  preselectedHw?: HomeworkItem | null;
}

export const StudentHomework: React.FC<StudentHomeworkProps> = ({
  homework,
  submissions,
  subjects,
  className,
  onSubmitHomework,
  preselectedHw,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'reviewed'>('all');
  const [selectedHwForSubmit, setSelectedHwForSubmit] = useState<HomeworkItem | null>(preselectedHw || null);
  const [answerText, setAnswerText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const openSubmitModal = (hw: HomeworkItem) => {
    const existingSub = submissions.find(s => s.homeworkId === hw.id);
    setSelectedHwForSubmit(hw);
    setAnswerText(existingSub ? existingSub.answerText : '');
    setAttachmentUrl(existingSub?.attachmentUrl || '');
    setSubmitSuccess(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwForSubmit || (!answerText.trim() && !attachmentUrl.trim())) return;

    setIsSubmitting(true);
    try {
      await onSubmitHomework(
        selectedHwForSubmit.id,
        selectedHwForSubmit.title,
        answerText.trim(),
        attachmentUrl.trim() || undefined
      );
      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedHwForSubmit(null);
        setSubmitSuccess(false);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHomework = homework.filter(hw => {
    const submission = submissions.find(s => s.homeworkId === hw.id);
    if (filterStatus === 'pending') return !submission;
    if (filterStatus === 'submitted') return submission && submission.status === 'submitted';
    if (filterStatus === 'reviewed') return submission && (submission.status === 'reviewed' || submission.status === 'returned');
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Homework & Practice Assignments for {className}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Submit your written answers, view teacher grading, marks scored, and personalized feedback.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200">
        {[
          { id: 'all', label: `All Tasks (${homework.length})` },
          {
            id: 'pending',
            label: `Pending Submission (${homework.filter(h => !submissions.some(s => s.homeworkId === h.id)).length})`,
          },
          {
            id: 'submitted',
            label: `Under Review (${submissions.filter(s => s.status === 'submitted').length})`,
          },
          {
            id: 'reviewed',
            label: `Graded & Feedback (${submissions.filter(s => s.status === 'reviewed' || s.status === 'returned').length})`,
          },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterStatus === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Homework List */}
      {filteredHomework.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
          No homework assignments found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHomework.map(hw => {
            const submission = submissions.find(s => s.homeworkId === hw.id);
            const isPastDue = new Date(hw.dueDate) < new Date();
            const isReviewed = submission && (submission.status === 'reviewed' || submission.status === 'returned');

            return (
              <div
                key={hw.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                        {hw.subjectName}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {hw.chapterTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                        {hw.totalMarks} Marks
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{hw.title}</h3>
                  </div>

                  {/* Submission Status Badge */}
                  <div>
                    {isReviewed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <Award className="w-3.5 h-3.5" />
                        <span>Score: {submission.marks} / {hw.totalMarks}</span>
                      </span>
                    ) : submission ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Submitted (Under Review)</span>
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isPastDue ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due: {new Date(hw.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Teacher Instructions:</h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {hw.instructions}
                  </p>
                  {hw.attachmentUrl && (
                    <div className="pt-2">
                      <a
                        href={hw.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Worksheet / Reference File</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Teacher Feedback Card if Graded */}
                {isReviewed && submission.feedback && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Teacher's Written Feedback & Evaluation:</span>
                    </div>
                    <p className="text-xs text-emerald-900 leading-relaxed whitespace-pre-wrap pl-6">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                {/* Student's submitted answer summary if submitted */}
                {submission && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500">Your Submitted Answer:</span>
                    <p className="text-slate-800 line-clamp-2 font-mono text-[11px]">
                      {submission.answerText || 'Uploaded via attachment link'}
                    </p>
                    {submission.attachmentUrl && (
                      <a
                        href={submission.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline pt-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View your attached work file</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">
                    Deadline: {new Date(hw.dueDate).toLocaleString()}
                  </span>

                  <div>
                    {!submission ? (
                      <button
                        onClick={() => openSubmitModal(hw)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Work</span>
                      </button>
                    ) : !isReviewed ? (
                      <button
                        onClick={() => openSubmitModal(hw)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                      >
                        Edit / Resubmit Solution
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Evaluation Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Homework Submission Modal */}
      {selectedHwForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wide">
                  {selectedHwForSubmit.subjectName}
                </span>
                <h3 className="text-sm font-bold truncate max-w-xs">{selectedHwForSubmit.title}</h3>
              </div>
              <button
                onClick={() => setSelectedHwForSubmit(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Homework submitted successfully! Your teacher will review it.</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Type Your Solution / Written Answers:
                </label>
                <textarea
                  value={answerText}
                  onChange={e => setAnswerText(e.target.value)}
                  rows={6}
                  placeholder="Type your step-by-step answers, formulas, or final results..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Google Drive / Photo / Document Link (Optional):
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={e => setAttachmentUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... or document link"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Upload photos of your handwritten notebook to Google Drive, set permission to "Anyone with link can view", and paste the link here.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHwForSubmit(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!answerText.trim() && !attachmentUrl.trim())}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Turn In Homework'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
