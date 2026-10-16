# Security Specification - Brain Booster Classes Portal

## 1. Data Invariants & Authorization Boundaries

1. **Identity Integrity**: Users can never create or modify a profile for a UID other than `request.auth.uid`.
2. **Privilege Escalation Prevention**: A user cannot assign themselves `role: 'admin'` or `role: 'teacher'` or `status: 'approved'` during registration. New signups are locked to `role: 'student'` and `status: 'pending'`.
3. **Admin Privilege Lock**: Only verified teachers/admins (or the bootstrapped root administrator `brainboosterclasses4@gmail.com`) can approve or reject student registrations, modify student classes, or create/publish/update/delete recordings, notes, and homework assignments.
4. **Class Isolation**: Approved students can only read published recordings, notes, and homework belonging to their assigned `classId`.
5. **Draft Privacy**: Unapproved students and students from other classes cannot read drafts or published resources. Students can never see resources marked `status: 'draft'`.
6. **Student Submission Boundaries**: Students can only create, view, or update their own homework submissions (`studentId == request.auth.uid`). They cannot modify submission marks, feedback, or review status.
7. **Teacher Grading Authority**: Only teachers/admins can update submission `marks`, `feedback`, `status: 'reviewed'` / `'returned'`.
8. **PII Isolation**: Student profiles containing phone numbers, parent names, or personal details are readable only by the student themselves or teachers/admins.
9. **Tamper-Proof Document IDs**: All document IDs must adhere to `^[a-zA-Z0-9_\-]+$` and size <= 128 bytes to prevent ID poisoning and denial-of-wallet payload attacks.
10. **Bootstrapped Admin**: Root administrative access is granted to `brainboosterclasses4@gmail.com` and records stored in `/admins/{adminId}`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

Below are 12 malicious attack vectors that must be rejected with `PERMISSION_DENIED`:

1. **Self-Promotion to Admin via Registration**:
   `POST /users/attacker123` with `{ uid: "attacker123", email: "att@test.com", role: "admin", status: "approved", classId: "class-10" }`
   *Expected*: Rejected. Self-assigning `admin` role or `approved` status is forbidden.

2. **Student Attempting to Approve Another Student**:
   `UPDATE /users/student456` by `student123` with `{ status: "approved", classId: "class-12" }`
   *Expected*: Rejected. Only teachers/admins can approve or assign classes.

3. **Student Reading Other Classes' Homework**:
   `GET /homework/hw_class_12_chem` by `student_in_class_9`
   *Expected*: Rejected. Class mismatch.

4. **Student Reading Unpublished (Draft) Recordings**:
   `GET /recordings/draft_rec_1` by `approved_student` where `status: "draft"`
   *Expected*: Rejected. Students can only view published materials.

5. **Student Modifying Teacher's Recording**:
   `UPDATE /recordings/rec_1` by `student123` with `{ title: "Hacked Title" }`
   *Expected*: Rejected. Only teachers/admins can modify recordings.

6. **Student Reading Another Student's Homework Submission**:
   `GET /submissions/hw1_studentB` by `studentA`
   *Expected*: Rejected. Submissions are strictly private between student and teacher.

7. **Student Assigning Themselves High Marks**:
   `UPDATE /submissions/hw1_studentA` by `studentA` with `{ marks: 100, status: "reviewed" }`
   *Expected*: Rejected. Only teachers/admins can grade or review submissions.

8. **Shadow Field Injection in Notes**:
   `POST /notes/note_1` with extra secret field `{ isAdminBypass: true, backdoor: "..." }`
   *Expected*: Rejected. Schema Blueprint strictly validates allowed keys and lengths.

9. **ID Poisoning Attack (10KB Junk Document ID)**:
   `POST /users/A...[10,000 characters]`
   *Expected*: Rejected. `isValidId` restricts ID length to 128 characters alphanumeric.

10. **Impersonating Teacher Author ID in Homework**:
    `POST /homework/hw_hack` by student setting `authorId: "teacher_uid"`
    *Expected*: Rejected. Only verified teacher/admin can author homework.

11. **Unauthenticated Public Read of Student Roster**:
    `GET /users` by unauthenticated visitor
    *Expected*: Rejected. Public reads forbidden; student profiles require authentication and authorization.

12. **Tampering with Immutable Creation Timestamps**:
    `UPDATE /recordings/rec_1` by teacher changing `createdAt` to a backdated timestamp
    *Expected*: Rejected. `createdAt` is immutable.

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)

A test suite verifying these rules can run against the Firebase Local Emulator Suite using `@firebase/rules-unit-testing`.
