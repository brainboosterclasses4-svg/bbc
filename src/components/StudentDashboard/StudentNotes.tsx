import React, { useState } from 'react';
import { FileText, Search, Download, Eye, BookOpen, ExternalLink } from 'lucide-react';
import { NoteItem, SubjectItem } from '../../types';

interface StudentNotesProps {
  notes: NoteItem[];
  subjects: SubjectItem[];
  onOpenPdf: (note: NoteItem) => void;
  className: string;
}

export const StudentNotes: React.FC<StudentNotesProps> = ({
  notes,
  subjects,
  onOpenPdf,
  className,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = notes.filter(n => {
    const matchesSubject = selectedSubject === 'all' || n.subjectId === selectedSubject;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Note3 Handwritten PDF Notes & Study Materials</span>
          </h2>
          <p className="text-xs text-slate-500">
            Exported directly from Note3 digital canvas. Formula sheets, mind maps, and solved exercises.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes by formula, chapter, or keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex overflow-x-auto gap-1.5 py-1 sm:py-0">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedSubject === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedSubject === s.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No PDF Study Notes Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedSubject !== 'all'
              ? 'Try adjusting your search terms or filter.'
              : `Your teacher has not uploaded PDF notes for ${className} yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(note => (
            <div
              key={note.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="px-2.5 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                    {note.subjectName}
                  </span>
                  <span className="text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded">
                    {note.fileSize || 'PDF'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-400 truncate">{note.chapterTitle}</p>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2 leading-snug">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                  {note.description || 'Note3 handwritten study material and chapter formula summary.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Active'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenPdf(note)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read PDF</span>
                  </button>

                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
