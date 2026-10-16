# Brain Booster Classes — Online Learning Portal
> Professional, secure, mobile-friendly online coaching portal for Brain Booster Classes.

---

## 1. Overview & Architecture

This application is built for coaching businesses with zero ongoing operating costs using official free tiers:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Authentication**: Firebase Authentication (Google Sign-In & Email/Password)
- **Database**: Cloud Firestore (Enterprise/Standard on Spark free tier)
- **Video Lectures**: OBS Studio recorded .mp4 exports hosted on YouTube as **"Unlisted"** (100% free unlimited video streaming)
- **Study Materials**: Handwritten digital PDF notes exported from Note3, linked via Google Drive or direct storage
- **Security**: Attribute-Based Access Control (ABAC) in `firestore.rules` preventing unauthorized cross-class reads, student self-promotion, and draft leaks.
- **PWA**: Installable on Android and Windows/Mac desktop browsers.

---

## 2. Dell Laptop Setup (Complete Beginner Guide)

You do not need any coding experience to run and manage this portal on your Dell laptop.

### Step 1: Install Node.js
1. Visit [nodejs.org](https://nodejs.org).
2. Download the **LTS (Long Term Support)** installer for Windows.
3. Open the downloaded `.msi` file and click **Next** through the installer.

### Step 2: Open Terminal / Command Prompt
1. Press the **Windows Key** on your Dell laptop.
2. Type `cmd` or `PowerShell` and press **Enter**.
3. Navigate to your project folder:
   ```bash
   cd "C:\path\to\your\project"
   ```

### Step 3: Install Dependencies
Run:
```bash
npm install
```

### Step 4: Run the Local Development Server
Run:
```bash
npm run dev
```
Open your web browser (Chrome or Edge) and go to:
```
http://localhost:3000
```

---

## 3. Administrator & Teacher Account Setup

- Designated Super Admin Email: `brainboosterclasses4@gmail.com`
- When you sign in with this email (via Google or Email/Password), the portal automatically gives you full access to the **Teacher & Admin Dashboard**.
- From this dashboard, you can:
  1. Approve or reject student registrations
  2. Assign students to their correct class (Class 6 through Class 12)
  3. Publish OBS recordings (paste your YouTube Unlisted URL)
  4. Upload Note3 PDF notes (paste your Google Drive view-only URL)
  5. Create homework assignments with due dates and marks
  6. Review student submissions, assign marks, and write constructive feedback.

---

## 4. Zero-Cost Free Tier Breakdown (₹0 / $0 Budget)

| Service | Free Tier Allowance | How We Use It | Potential Cost |
| :--- | :--- | :--- | :--- |
| **Cloud Firestore** | 50,000 reads/day<br>20,000 writes/day<br>1 GB data storage | Stores user profiles, assignments, note metadata, and marks. (With 100 students, you use ~2,000 reads/day) | **₹0 / Free Forever** |
| **OBS Video Streaming** | Unlimited hours, 1080p | Upload to YouTube as **"Unlisted"** and paste the link into the portal. | **₹0 / Free Forever** |
| **Note3 PDF Notes** | 15 GB free per Google Account | Export PDF from Note3, upload to Google Drive ("Anyone with link can view"), paste link. | **₹0 / Free Forever** |
| **Web Hosting** | 100 GB bandwidth/month | Deploy to Vercel, Netlify, or Firebase Hosting. | **₹0 / Free Forever** |

---

## 5. Free Deployment Instructions

### Deploy to Vercel (Easiest - 2 Minutes)
1. Sign up for a free account at [vercel.com](https://vercel.com).
2. Connect your GitHub repository or drag and drop your project directory.
3. Vercel automatically detects Vite and provides you a free custom URL (e.g., `https://brain-booster-classes.vercel.app`).

### Deploy to Firebase Hosting
In your Dell laptop terminal:
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

---

## 6. Security & Functionality Verification Checklist

You can test these scenarios directly using the **"Switch Role Preview"** bar in the top navigation:

- [x] **Scenario A: Pending Student**
  - Register a new student or switch to "Pending Student".
  - Verify that the portal shows the "Registration Pending Approval" screen.
  - Verify that no class recordings, homework, or notes can be read.
  - Database rules reject any unauthorized read attempts.

- [x] **Scenario B: Approved Class 10 Student**
  - Switch to "Class 10 Student".
  - Verify that student sees only Class 10 lectures, Note3 notes, and assignments.
  - Turn in a homework solution with written text and a link.
  - Check that marks and feedback are displayed once graded.
  - Verify that the student cannot modify their role or grade.

- [x] **Scenario C: Lead Teacher / Admin**
  - Switch to "Teacher Mode" (or sign in with `brainboosterclasses4@gmail.com`).
  - Approve pending student registrations and assign their official class.
  - Publish new OBS recordings and Note3 PDF notes.
  - Grade student submissions and release feedback.
