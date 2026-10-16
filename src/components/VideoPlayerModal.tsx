import React from 'react';
import { X, ExternalLink, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { Recording } from '../types';

interface VideoPlayerModalProps {
  recording: Recording | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ recording, onClose }) => {
  if (!recording) return null;

  // Convert YouTube standard URL or youtu.be to embed URL
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}?autoplay=1&rel=0` : url;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
      }
      if (url.includes('drive.google.com/file/d/')) {
        const id = url.split('/d/')[1]?.split('/')[0];
        return `https://drive.google.com/file/d/${id}/preview`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(recording.videoUrl);
  const isEmbeddable = embedUrl.includes('youtube.com/embed') || embedUrl.includes('drive.google.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white tracking-wide uppercase">
              {recording.subjectName}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {recording.chapterTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {isEmbeddable ? (
            <iframe
              src={embedUrl}
              title={recording.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-6 text-slate-300">
              <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="text-base font-semibold mb-2">Direct Cloud Storage / External Player</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                This recording link is hosted on a cloud provider that does not permit direct in-line embedding, or requires custom permissions.
              </p>
              <a
                href={recording.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow"
              >
                <span>Open Video in New Tab</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Details and metadata */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{recording.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Recorded: {recording.lessonDate || 'Recent Session'}</span>
                {recording.duration && <span>• Duration: {recording.duration}</span>}
                <span>• Recorded using OBS Studio</span>
              </div>
            </div>

            <a
              href={recording.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 self-start sm:self-auto"
            >
              <span>Watch on Host</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Lesson Description & Key Concepts Covered
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {recording.description || 'No additional notes provided for this recording.'}
            </p>
          </div>

          {/* Zero-Cost OBS Teacher Tip */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-3 text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-950">Teacher Note on OBS Recordings & Zero-Cost Privacy:</p>
              <p className="text-blue-800/90 mt-0.5">
                Upload your OBS mp4 exports to YouTube as <strong>"Unlisted"</strong>. This gives you 100% free, high-speed, unlimited cloud video hosting without bandwidth fees. Only students logged into Brain Booster Classes with this portal link can view it!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
