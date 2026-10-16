import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  UserCheck,
  GraduationCap,
  Mail,
  Phone,
  Clock,
  Search,
  Filter,
  Trash2,
  Check,
  AlertCircle,
  Users,
} from 'lucide-react';
import { UserProfile, ClassItem } from '../../types';

interface StudentApprovalsProps {
  students: UserProfile[];
  classes: ClassItem[];
  onApprove: (studentId: string, classId: string, className: string) => Promise<void>;
  onReject: (studentId: string) => Promise<void>;
  onUpdateStudentClass: (studentId: string, classId: string, className: string) => Promise<void>;
  onDeleteStudent: (studentId: string) => Promise<void>;
}

export const StudentApprovals: React.FC<StudentApprovalsProps> = ({
  students,
  classes,
  onApprove,
  onReject,
  onUpdateStudentClass,
  onDeleteStudent,
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pendingStudents = students.filter(s => s.status === 'pending');
  const approvedStudents = students.filter(s => s.status === 'approved');

  const filteredApproved = approvedStudents.filter(s => {
    const matchesClass = filterClass === 'all' || s.classId === filterClass;
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleApproveClick = async (student: UserProfile, selectedClassId?: string) => {
    setActionLoading(student.uid);
    try {
      const targetClassId = selectedClassId || student.classId || 'class-10';
      const targetClass = classes.find(c => c.id === targetClassId);
      await onApprove(student.uid, targetClassId, targetClass ? targetClass.name : 'Class 10');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to reject this registration request?')) return;
    setActionLoading(studentId);
    try {
      await onReject(studentId);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Pending Approvals Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              {pendingStudents.length}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pending Student Registrations</h3>
              <p className="text-xs text-slate-500">Students waiting for approval and class assignment</p>
            </div>
          </div>
        </div>

        {pendingStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">All Caught Up!</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no pending student registration requests. When new students sign up on the portal, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingStudents.map(student => (
              <div
                key={student.uid}
                className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                      Pending Request
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{student.fullName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {student.email}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {student.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Requested Class:</span>
                    <span className="font-semibold text-blue-700">{student.className || 'Class 10'}</span>
                  </div>
                  {student.parentName && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Parent / Guardian:</span>
                      <span className="font-medium text-slate-800">{student.parentName}</span>
                    </div>
                  )}
                  {student.parentPhone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Parent Contact:</span>
                      <span className="font-medium text-slate-800">{student.parentPhone}</span>
                    </div>
                  )}
                </div>

                {/* Class Assignment Selector before approving */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Assign Final Academic Class:
                  </label>
                  <select
                    defaultValue={student.classId || 'class-10'}
                    id={`assign-class-${student.uid}`}
                    className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    disabled={actionLoading === student.uid}
                    onClick={() => {
                      const selectEl = document.getElementById(`assign-class-${student.uid}`) as HTMLSelectElement;
                      handleApproveClick(student, selectEl ? selectEl.value : student.classId);
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Student</span>
                  </button>

                  <button
                    disabled={actionLoading === student.uid}
                    onClick={() => handleRejectClick(student.uid)}
                    className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Students Roster Section */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>Enrolled & Approved Students ({approvedStudents.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Active students receiving class-specific homework and recordings</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by student name..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
              />
            </div>

            {/* Filter by class */}
            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredApproved.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-500 text-xs">
            No approved students found matching the selected filter.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Assigned Class</th>
                    <th className="py-3 px-4">Parent Details</th>
                    <th className="py-3 px-4">Enrolled On</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApproved.map(student => (
                    <tr key={student.uid} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{student.fullName}</span>
                            <span className="text-[11px] text-slate-500">{student.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={student.classId}
                          onChange={(e) => {
                            const selected = classes.find(c => c.id === e.target.value);
                            onUpdateStudentClass(student.uid, e.target.value, selected ? selected.name : 'Class 10');
                          }}
                          className="py-1 px-2 border border-slate-200 rounded-md font-semibold text-blue-700 bg-blue-50/50 hover:border-blue-300 text-xs focus:outline-none"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {student.parentName || student.parentPhone ? (
                          <div>
                            {student.parentName && <div>{student.parentName}</div>}
                            {student.parentPhone && <div className="text-[11px] text-slate-400">{student.parentPhone}</div>}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not provided</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove student ${student.fullName}?`)) {
                              onDeleteStudent(student.uid);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Remove Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
