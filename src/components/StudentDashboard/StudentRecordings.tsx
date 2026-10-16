import React, { useState } from 'react';
import { Video, Play, Search, Filter, Clock, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { Recording, SubjectItem } from '../../types';

interface StudentRecordingsProps {
  recordings: Recording[];
  subjects: SubjectItem[];
  onPlayRecording: (recording: Recording) => void;
  className: string;
}

export const StudentRecordings: React.FC<StudentRecordingsProps> = ({
  recordings,
  subjects,
  onPlayRecording,
  className,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = recordings.filter(rec => {
    const matchesSubject = selectedSubject === 'all' || rec.subjectId === selectedSubject;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-600" />
            <span>OBS Recorded Classes for {className}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Recorded live using OBS Studio. Select any session to watch and review lessons.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by lecture title, chapter, or topic..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex overflow-x-auto gap-1.5 py-1 sm:py-0">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedSubject === 'all'
                ? 'bg-blue-600 text-white'
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Recorded Lectures Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedSubject !== 'all'
              ? 'Try adjusting your search query or subject filter.'
              : `Your teacher hasn't published recordings for ${className} yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(rec => (
            <div
              key={rec.id}
              onClick={() => onPlayRecording(rec)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition duration-200 flex flex-col justify-between cursor-pointer group"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={rec.thumbnailUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition shadow-lg">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white tracking-wide uppercase">
                    {rec.subjectName}
                  </span>
                </div>

                {rec.duration && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{rec.duration}</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-[11px] font-semibold text-blue-600 truncate">{rec.chapterTitle}</p>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5 group-hover:text-blue-600 transition leading-snug">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{rec.lessonDate || 'Recent'}</span>
                  <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
                    <span>Watch Now</span>
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
