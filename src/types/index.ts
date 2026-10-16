export type UserRole = 'student' | 'teacher' | 'admin' | 'pending';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ResourceStatus = 'published' | 'draft';
export type SubmissionStatus = 'submitted' | 'reviewed' | 'returned';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  classId: string;
  className: string;
  status: ApprovalStatus;
  parentName?: string;
  parentPhone?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  order: number;
  description?: string;
  createdAt?: string;
}

export interface SubjectItem {
  id: string;
  classId: string;
  name: string;
  color?: string;
  createdAt?: string;
}

export interface Recording {
  id: string;
  title: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;
  lessonDate: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  status: ResourceStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteItem {
  id: string;
  title: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;
  description: string;
  fileUrl: string;
  fileSize?: string;
  status: ResourceStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;
  instructions: string;
  attachmentUrl?: string;
  dueDate: string;
  totalMarks: number;
  status: ResourceStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionItem {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  answerText: string;
  attachmentUrl?: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  marks?: number;
  feedback?: string;
  reviewedBy?: string;
}
