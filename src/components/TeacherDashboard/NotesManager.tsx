import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Search,
  Filter,
  Sparkles,
  Download,
} from 'lucide-react';
import { NoteItem, ClassItem, SubjectItem } from '../../types';

interface NotesManagerProps {
  notes: NoteItem[];
  classes: ClassItem[];
  subjects: SubjectItem[];
  onSaveNote: (note: Partial<NoteItem>) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
  onPreview: (note: NoteItem) => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  notes,
  classes,
  subjects,
  onSaveNote,
  onDeleteNote,
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
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('2.5 MB');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const classSubjects = subjects.filter(s => s.classId === classId);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setClassId(classes[0]?.id || 'class-10');
    setSubjectId(subjects.find(s => s.classId === (classes[0]?.id || 'class-10'))?.id || '');
    setChapterTitle('');
    setFileUrl('');
    setFileSize('2.5 MB');
    setDescription('');
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (note: NoteItem) => {
    setEditingId(note.id);
    setTitle(note.title);
    setClassId(note.classId);
    setSubjectId(note.subjectId);
    setChapterTitle(note.chapterTitle);
    setFileUrl(note.fileUrl);
    setFileSize(note.fileSize || '2.5 MB');
    setDescription(note.description);
    setStatus(note.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) return;

    setLoading(true);
    try {
      const selectedSubject = subjects.find(s => s.id === subjectId);
      const subjectName = selectedSubject ? selectedSubject.name : 'General';

      await onSaveNote({
        id: editingId || `note-${Date.now()}`,
        title,
        classId,
        subjectId,
        subjectName,
        chapterTitle: chapterTitle || 'Study Material',
        fileUrl,
        fileSize,
        description,
        status,
      });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const filtered = notes.filter(n => {
    const matchesClass = filterClass === 'all' || n.classId === filterClass;
    const matchesSubject = filterSubject === 'all' || n.subjectId === filterSubject;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Note3 PDF Notes & Study Materials ({notes.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Organize handwritten Note3 PDF notes, mind maps, and formula sheets by class & subject.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note3 PDF Material</span>
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
            placeholder="Search notes by topic or chapter..."
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

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No PDF Notes Uploaded</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Add Note3 PDF Material" above to share handwritten notes and formula sheets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(note => {
            const cls = classes.find(c => c.id === note.classId);
            return (
              <div
                key={note.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {cls ? cls.name : note.classId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {note.subjectName}
                      </span>
                    </div>
                    {note.status === 'draft' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Published
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-400">{note.chapterTitle}</p>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mt-1.5">
                    {note.description || 'Note3 handwritten study material and chapter formula summary.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-400">
                    PDF • {note.fileSize || 'Standard'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onPreview(note)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      title="Read PDF"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                    <button
                      onClick={() => openEditModal(note)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete note: "${note.title}"?`)) {
                          onDeleteNote(note.id);
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

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingId ? 'Edit Note3 PDF Study Material' : 'Add Note3 PDF Study Material'}
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
                <label className="block font-semibold text-slate-700 mb-1">Title of Study Material *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Note3 Handwritten Notes - Quadratic Equations Formulas"
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
                  <label className="block font-semibold text-slate-700 mb-1">Chapter / Unit</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={e => setChapterTitle(e.target.value)}
                    placeholder="e.g. Chapter 4: Quadratic Equations"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Size Tag</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={e => setFileSize(e.target.value)}
                    placeholder="e.g. 2.4 MB"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  PDF / Cloud Storage Link *
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={e => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... or PDF direct link"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Export from Note3 app to PDF, upload to Google Drive (set to "Anyone with link can view"), and paste the link here.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Publication Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="published">Published (Visible to Class Students)</option>
                  <option value="draft">Draft (Saved privately)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Topic Summary</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Highlight key points, exam weightage, or topics covered..."
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
                  {loading ? 'Saving...' : editingId ? 'Update Material' : 'Publish Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
