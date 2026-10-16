import React from 'react';
import { X, ExternalLink, Download, FileText, Sparkles, BookOpen } from 'lucide-react';
import { NoteItem } from '../types';

interface PdfViewerModalProps {
  note: NoteItem | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ note, onClose }) => {
  if (!note) return null;

  // Convert Google Drive view link to preview link for iframe embedding
  const getEmbeddablePdfUrl = (url: string) => {
    try {
      if (url.includes('drive.google.com/file/d/')) {
        const id = url.split('/d/')[1]?.split('/')[0];
        return `https://drive.google.com/file/d/${id}/preview`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const previewUrl = getEmbeddablePdfUrl(note.fileUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-blue-600/30 text-blue-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-semibold truncate text-white">{note.title}</h2>
              <p className="text-xs text-slate-400 truncate">
                {note.subjectName} • {note.chapterTitle} {note.fileSize ? `(${note.fileSize})` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={note.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <a
              href={note.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Tab</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
          <iframe
            src={previewUrl}
            title={note.title}
            className="w-full h-full border-0 bg-white"
          />
        </div>

        {/* Footer info & Note3 tips */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="line-clamp-1">{note.description || 'Handwritten study material exported from Note3.'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
            <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
            <span>Note3 Digital Export: Clean vector strokes & easy print layout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
