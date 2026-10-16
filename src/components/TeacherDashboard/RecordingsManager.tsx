import React, { useState } from 'react';
import {
  Video,
  Plus,
  Play,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { Recording, ClassItem, SubjectItem } from '../../types';

interface RecordingsManagerProps {
  recordings: Recording[];
  classes: ClassItem[];
  subjects: SubjectItem[];
  onSaveRecording: (recording: Partial<Recording>) => Promise<void>;
  onDeleteRecording: (id: string) => Promise<void>;
  onPreview: (recording: Recording) => void;
}

export const RecordingsManager: React.FC<RecordingsManagerProps> = ({
  recordings,
  classes,
  subjects,
  onSaveRecording,
  onDeleteRecording,
  onPreview,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || 'class-10');
  const [subjectId, setSubjectId] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [lessonDate, setLessonDate] = useState(new Date().toISOString().split('T')[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // Filter subjects for the selected class
  const classSubjects = subjects.filter(s => s.classId === classId);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setClassId(classes[0]?.id || 'class-10');
    setSubjectId(subjects.find(s => s.classId === (classes[0]?.id || 'class-10'))?.id || '');
    setChapterTitle('');
    setLessonDate(new Date().toISOString().split('T')[0]);
    setVideoUrl('');
    setThumbnailUrl('');
    setDuration('45 mins');
    setDescription('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (rec: Recording) => {
    setEditingId(rec.id);
    setTitle(rec.title);
    setClassId(rec.classId);
    setSubjectId(rec.subjectId);
    setChapterTitle(rec.chapterTitle);
    setLessonDate(rec.lessonDate);
    setVideoUrl(rec.videoUrl);
    setThumbnailUrl(rec.thumbnailUrl || '');
    setDuration(rec.duration || '');
    setDescription(rec.description);
    setStatus(rec.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    setLoading(true);
    try {
      const selectedSubject = subjects.find(s => s.id === subjectId);
      const subjectName = selectedSubject ? selectedSubject.name : 'General';

      await onSaveRecording({
        id: editingId || `rec-${Date.now()}`,
        title,
        classId,
        subjectId,
        subjectName,
        chapterTitle: chapterTitle || 'General Chapter',
        lessonDate,
        videoUrl,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        duration,
        description,
        status,
      });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const filtered = recordings.filter(r => {
    const matchesClass = filterClass === 'all' || r.classId === filterClass;
    const matchesSubject = filterSubject === 'all' || r.subjectId === filterSubject;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            <span>OBS Recorded Classes ({recordings.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Publish your OBS recordings. Students see only their class lessons.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add OBS Recording</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by lecture title or chapter..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recordings Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No Recordings Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Add OBS Recording" above to post your first class video for students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(rec => {
            const cls = classes.find(c => c.id === rec.classId);
            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
              >
                {/* Thumbnail / Video Preview Area */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={rec.thumbnailUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <button
                      onClick={() => onPreview(rec)}
                      className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center hover:scale-110 hover:bg-blue-600 transition shadow-lg"
                      title="Play Recording"
                    >
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      {cls ? cls.name : rec.classId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                      {rec.subjectName}
                    </span>
                  </div>
                  {rec.duration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rec.duration}</span>
                    </div>
                  )}
                  {rec.status === 'draft' && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                      Draft (Hidden)
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold text-blue-600 truncate">{rec.chapterTitle}</p>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {rec.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{rec.lessonDate || 'Recent'}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(rec)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete recording: "${rec.title}"?`)) {
                            onDeleteRecording(rec.id);
                          }
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Recording Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingId ? 'Edit OBS Recording' : 'Add New OBS Recording'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lecture Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Quadratic Equations - Lecture 01 Roots Concept"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Class *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Chapter / Unit Topic</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={e => setChapterTitle(e.target.value)}
                    placeholder="e.g. Chapter 4: Quadratic Equations"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recording Date</label>
                  <input
                    type="date"
                    value={lessonDate}
                    onChange={e => setLessonDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Video URL (YouTube Unlisted or Cloud Storage Link) *
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Paste the Unlisted YouTube link of your OBS export for 100% free streaming.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Video Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 52 mins"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
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
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Topic Notes</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Summarize key formulas and topics discussed in this session..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
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
                  {loading ? 'Saving...' : editingId ? 'Update Recording' : 'Publish Recording'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
