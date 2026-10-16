import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Users,
  Award,
  Send,
  MessageSquare,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { HomeworkItem, SubmissionItem, ClassItem, SubjectItem, UserProfile } from '../../types';

interface HomeworkManagerProps {
  homework: HomeworkItem[];
  submissions: SubmissionItem[];
  classes: ClassItem[];
  subjects: SubjectItem[];
  onSaveHomework: (hw: Partial<HomeworkItem>) => Promise<void>;
  onDeleteHomework: (id: string) => Promise<void>;
  onGradeSubmission: (
    submissionId: string,
    marks: number,
    feedback: string,
    status: 'reviewed' | 'returned'
  ) => Promise<void>;
}

export const HomeworkManager: React.FC<HomeworkManagerProps> = ({
  homework,
  submissions,
  classes,
  subjects,
  onSaveHomework,
  onDeleteHomework,
  onGradeSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions'>('assignments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHwForReview, setSelectedHwForReview] = useState<HomeworkItem | null>(null);

  // Reviewing a specific submission state
  const [activeReviewSubmission, setActiveReviewSubmission] = useState<SubmissionItem | null>(null);
  const [reviewMarks, setReviewMarks] = useState<number>(0);
  const [reviewFeedback, setReviewFeedback] = useState<string>('');
  const [savingGrade, setSavingGrade] = useState(false);

  // Homework Form State
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || 'class-10');
  const [subjectId, setSubjectId] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalMarks, setTotalMarks] = useState(25);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [loading, setLoading] = useState(false);

  const classSubjects = subjects.filter(s => s.classId === classId);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setClassId(classes[0]?.id || 'class-10');
    setSubjectId(subjects.find(s => s.classId === (classes[0]?.id || 'class-10'))?.id || '');
    setChapterTitle('');
    setInstructions('');
    setAttachmentUrl('');
    // Default due date: 7 days from now at 18:00
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDueDate(d.toISOString().slice(0, 16));
    setTotalMarks(25);
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (hw: HomeworkItem) => {
    setEditingId(hw.id);
    setTitle(hw.title);
    setClassId(hw.classId);
    setSubjectId(hw.subjectId);
    setChapterTitle(hw.chapterTitle);
    setInstructions(hw.instructions);
    setAttachmentUrl(hw.attachmentUrl || '');
    setDueDate(hw.dueDate);
    setTotalMarks(hw.totalMarks);
    setStatus(hw.status);
    setIsModalOpen(true);
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructions) return;

    setLoading(true);
    try {
      const selectedSubject = subjects.find(s => s.id === subjectId);
      const subjectName = selectedSubject ? selectedSubject.name : 'General';

      await onSaveHomework({
        id: editingId || `hw-${Date.now()}`,
        title,
        classId,
        subjectId,
        subjectName,
        chapterTitle: chapterTitle || 'Practice Worksheet',
        instructions,
        attachmentUrl,
        dueDate,
        totalMarks: Number(totalMarks),
        status,
      });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = (sub: SubmissionItem) => {
    setActiveReviewSubmission(sub);
    const relatedHw = homework.find(h => h.id === sub.homeworkId);
    setReviewMarks(sub.marks !== undefined ? sub.marks : (relatedHw ? Math.round(relatedHw.totalMarks * 0.8) : 20));
    setReviewFeedback(sub.feedback || 'Good attempt! Well-structured solution.');
  };

  const handleSaveGrade = async (gradeStatus: 'reviewed' | 'returned') => {
    if (!activeReviewSubmission) return;
    setSavingGrade(true);
    try {
      await onGradeSubmission(activeReviewSubmission.id, reviewMarks, reviewFeedback, gradeStatus);
      setActiveReviewSubmission(null);
    } finally {
      setSavingGrade(false);
    }
  };

  const filteredHomework = homework.filter(h => {
    const matchesClass = filterClass === 'all' || h.classId === filterClass;
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'submitted').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Homework Assignments ({homework.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Student Submissions ({submissions.length})</span>
            {pendingSubmissionsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {pendingSubmissionsCount} pending review
              </span>
            )}
          </button>
        </div>

        {activeTab === 'assignments' && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Homework</span>
          </button>
        )}
      </div>

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search homework by title or topic..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Homework list */}
          {filteredHomework.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-xs text-slate-500">
              No homework assignments created yet. Click "Create Homework" to set your first task!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHomework.map(hw => {
                const cls = classes.find(c => c.id === hw.classId);
                const hwSubmissions = submissions.filter(s => s.homeworkId === hw.id);
                const isPastDue = new Date(hw.dueDate) < new Date();

                return (
                  <div
                    key={hw.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {cls ? cls.name : hw.classId}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {hw.subjectName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {hw.totalMarks} Marks
                          </span>
                          {hw.status === 'draft' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Draft
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{hw.title}</h4>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">{hw.chapterTitle}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                        {hw.instructions}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className={isPastDue ? 'text-rose-600 font-semibold' : ''}>
                          Due: {hw.dueDate ? new Date(hw.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Open'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedHwForReview(hw);
                            setActiveTab('submissions');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{hwSubmissions.length} Submissions</span>
                        </button>
                        <button
                          onClick={() => openEditModal(hw)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete homework "${hw.title}"?`)) {
                              onDeleteHomework(hw.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">
              {selectedHwForReview
                ? `Submissions for: ${selectedHwForReview.title}`
                : `All Student Submissions (${submissions.length})`}
            </h4>
            {selectedHwForReview && (
              <button
                onClick={() => setSelectedHwForReview(null)}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Show All Submissions
              </button>
            )}
          </div>

          {submissions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
              No homework submissions received yet. When students submit their written solutions or file links, you can review and grade them here!
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Homework Task</th>
                      <th className="py-3 px-4">Submission Status</th>
                      <th className="py-3 px-4">Score & Grade</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions
                      .filter(s => !selectedHwForReview || s.homeworkId === selectedHwForReview.id)
                      .map(sub => {
                        const relatedHw = homework.find(h => h.id === sub.homeworkId);
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                              <span className="text-[11px] text-slate-500">{sub.studentEmail}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-800 block truncate max-w-xs">
                                {sub.homeworkTitle || relatedHw?.title}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {sub.status === 'reviewed' || sub.status === 'returned' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Graded & Returned</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                                  <Clock className="w-3 h-3" />
                                  <span>Pending Review</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {sub.marks !== undefined ? (
                                <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                                  {sub.marks} / {relatedHw?.totalMarks || 25}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Not graded</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleStartReview(sub)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition"
                              >
                                {sub.status === 'reviewed' ? 'Edit Grade' : 'Grade & Feedback'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Homework Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingId ? 'Edit Homework Assignment' : 'Create New Homework Assignment'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitHomework} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Homework Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Exercise 4.3 Practice Worksheet & Word Problems"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class *</label>
                  <select
                    value={classId}
                    onChange={e => {
                      setClassId(e.target.value);
                      const firstSub = subjects.find(s => s.classId === e.target.value);
                      if (firstSub) setSubjectId(firstSub.id);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={subjectId}
                    onChange={e => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {classSubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chapter / Topic</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={e => setChapterTitle(e.target.value)}
                    placeholder="e.g. Chapter 4: Quadratic Equations"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={e => setTotalMarks(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Submission Due Date & Time *</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference Worksheet / Attachment Link</label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={e => setAttachmentUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or PDF worksheet link"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Instructions for Students *</label>
                <textarea
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows={4}
                  placeholder="Explain which questions to solve, steps required, and how to submit..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="published">Published (Visible to Students)</option>
                  <option value="draft">Draft (Saved Privately)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Homework' : 'Publish Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submission Review & Grading Modal */}
      {activeReviewSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-bold">Review & Grade Student Homework</h3>
              </div>
              <button
                onClick={() => setActiveReviewSubmission(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Student info */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400">Student Name</span>
                  <p className="text-sm font-bold text-slate-900">{activeReviewSubmission.studentName}</p>
                  <p className="text-[11px] text-slate-500">{activeReviewSubmission.studentEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Submitted At</span>
                  <p className="font-semibold text-slate-800">
                    {new Date(activeReviewSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Student's answer text */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student's Written Solution:</label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl whitespace-pre-wrap text-slate-800 leading-relaxed font-mono text-[11px]">
                  {activeReviewSubmission.answerText || 'No typed answer text provided.'}
                </div>
              </div>

              {/* Attachment link if student provided one */}
              {activeReviewSubmission.attachmentUrl && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-medium text-blue-900 truncate">
                      Work Attachment: {activeReviewSubmission.attachmentUrl}
                    </span>
                  </div>
                  <a
                    href={activeReviewSubmission.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shrink-0"
                  >
                    Open Work
                  </a>
                </div>
              )}

              {/* Teacher Marks Input */}
              <div className="pt-2">
                <label className="block font-bold text-slate-900 mb-1">
                  Marks Awarded (out of {homework.find(h => h.id === activeReviewSubmission.homeworkId)?.totalMarks || 25}):
                </label>
                <input
                  type="number"
                  value={reviewMarks}
                  onChange={e => setReviewMarks(Number(e.target.value))}
                  min={0}
                  max={homework.find(h => h.id === activeReviewSubmission.homeworkId)?.totalMarks || 100}
                  className="w-32 px-3 py-2 border-2 border-purple-300 rounded-xl text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Teacher Written Feedback */}
              <div>
                <label className="block font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Teacher's Written Feedback & Corrections:</span>
                </label>
                <textarea
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  rows={4}
                  placeholder="e.g. Excellent work on questions 1-5. In question 6, check the negative sign on line 3. Well done!"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewSubmission(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingGrade}
                  onClick={() => handleSaveGrade('reviewed')}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{savingGrade ? 'Releasing...' : 'Release Marks & Feedback to Student'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
