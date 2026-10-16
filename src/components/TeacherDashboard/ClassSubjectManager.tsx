import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, BookOpen, Check, Sparkles } from 'lucide-react';
import { ClassItem, SubjectItem } from '../../types';

interface ClassSubjectManagerProps {
  classes: ClassItem[];
  subjects: SubjectItem[];
  onAddSubject: (classId: string, name: string, color: string) => Promise<void>;
  onDeleteSubject: (subjectId: string) => Promise<void>;
  onAddClass: (name: string, description: string) => Promise<void>;
  onSeedData: () => Promise<void>;
}

export const ClassSubjectManager: React.FC<ClassSubjectManagerProps> = ({
  classes,
  subjects,
  onAddSubject,
  onDeleteSubject,
  onAddClass,
  onSeedData,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class-10');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('blue');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // New Class Form State
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');

  const currentSubjects = subjects.filter(s => s.classId === selectedClassId);
  const currentClass = classes.find(c => c.id === selectedClassId);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddSubject(selectedClassId, newSubjectName.trim(), newSubjectColor);
      setNewSubjectName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddClass(newClassName.trim(), newClassDesc.trim());
      setNewClassName('');
      setNewClassDesc('');
      setShowAddClass(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunSeed = async () => {
    if (!window.confirm('Populate default coaching classes, subjects, sample OBS recordings, Note3 notes, and homework?')) return;
    setSeeding(true);
    try {
      await onSeedData();
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Academic Curriculum & Subject Manager</span>
          </h3>
          <p className="text-xs text-slate-500">
            Customize school subjects and classes. Fully dynamic: add new subjects anytime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSeed}
            disabled={seeding}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{seeding ? 'Seeding...' : 'Load Default Syllabus & Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Class Selector Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-700">Select Academic Class:</label>
          <button
            onClick={() => setShowAddClass(!showAddClass)}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Class / Batch</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {classes.map(cls => {
            const isSelected = cls.id === selectedClassId;
            const count = subjects.filter(s => s.classId === cls.id).length;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cls.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count} subjects
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Class Mini Form */}
        {showAddClass && (
          <form onSubmit={handleCreateClass} className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Add New Academic Class or Batch</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                placeholder="Class Name (e.g. Class 11 - JEE Crash Batch)"
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                required
              />
              <input
                type="text"
                value={newClassDesc}
                onChange={e => setNewClassDesc(e.target.value)}
                placeholder="Description / Stream focus"
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddClass(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                Add Class
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Active Class Subjects Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Subjects for {currentClass ? currentClass.name : 'Class'} ({currentSubjects.length})
            </h4>
            <p className="text-xs text-slate-500">
              Teachers can add or rename subjects freely (e.g. Mathematics, Science, Computer, Physics).
            </p>
          </div>
        </div>

        {/* Add Subject Inline Form */}
        <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newSubjectName}
            onChange={e => setNewSubjectName(e.target.value)}
            placeholder="Add new subject name (e.g. Biology, Social Science, Hindi)..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </form>

        {/* Subjects List */}
        {currentSubjects.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No subjects configured for this class yet. Type a subject name above to add it.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentSubjects.map(sub => (
              <div
                key={sub.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{sub.name}</h5>
                    <span className="text-[10px] text-slate-400">Class Subject</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete subject "${sub.name}" from this class?`)) {
                      onDeleteSubject(sub.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Remove Subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
