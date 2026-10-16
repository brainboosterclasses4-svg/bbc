import React, { useState } from 'react';
import {
  X,
  Laptop,
  CheckCircle2,
  DollarSign,
  Cloud,
  ShieldCheck,
  Video,
  FileText,
  Users,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'laptop' | 'free' | 'obs_note3' | 'testing' | 'deploy'>('laptop');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Laptop className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Dell Laptop Setup & Zero-Cost Operations Guide</h2>
              <p className="text-xs text-blue-100">Brain Booster Classes • Complete Beginner Step-by-Step Manual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-blue-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-6 gap-2">
          {[
            { id: 'laptop', label: '1. Dell Laptop Setup', icon: Laptop },
            { id: 'free', label: '2. Zero-Cost Free Tiers', icon: DollarSign },
            { id: 'obs_note3', label: '3. OBS & Note3 Workflows', icon: Video },
            { id: 'testing', label: '4. Testing Checklist', icon: ShieldCheck },
            { id: 'deploy', label: '5. Free Deployment', icon: Cloud },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {activeTab === 'laptop' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
                <strong>Welcome!</strong> You do not need any previous programming background. Everything runs directly on your Dell laptop using free standard open-source tools.
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                  Install Node.js (Long Term Support) on your Dell Laptop
                </h3>
                <p className="text-xs text-slate-600 mb-2">
                  Node.js is the free software engine that runs web applications on Windows 10/11:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 pl-1">
                  <li>Open Chrome or Edge on your Dell laptop and visit <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">nodejs.org</a></li>
                  <li>Click on <strong>LTS (Recommended for Most Users)</strong> to download the Windows Installer (.msi).</li>
                  <li>Double-click the downloaded file, click "Next" on all prompts, and finish installation.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                  Open Terminal / Command Prompt in your Project Folder
                </h3>
                <p className="text-xs text-slate-600 mb-2">
                  Press the <strong>Windows Key</strong> on your Dell laptop keyboard, type <strong>PowerShell</strong> or <strong>cmd</strong>, and press Enter.
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Step A: Install project dependencies</span>
                      <button
                        onClick={() => copyToClipboard('npm install', 'c1')}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        {copiedIndex === 'c1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto">npm install</pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Step B: Start your local development server</span>
                      <button
                        onClick={() => copyToClipboard('npm run dev', 'c2')}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        {copiedIndex === 'c2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto">npm run dev</pre>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Open your browser and navigate to <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">http://localhost:3000</code> to see the portal live!
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                  Root Administrator Setup
                </h3>
                <p className="text-xs text-slate-600">
                  Your designated administrator email is: <strong className="text-slate-900 font-mono">brainboosterclasses4@gmail.com</strong>.
                  When you sign in using Google or register with this email, the portal automatically identifies you as the Super Admin & Lead Teacher with full dashboard access.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'free' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Total Expected Operating Cost: ₹0 / $0 (100% Free Forever for your Coaching)
                </h3>
                <p className="text-xs text-emerald-800">
                  Here is the exact breakdown of the free limits and how to never pay a single rupee.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">1. Firebase Firestore (Database)</h4>
                  <p className="text-xs text-slate-600 mb-2">Free Spark Tier includes:</p>
                  <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
                    <li><strong>50,000 document reads per day</strong></li>
                    <li><strong>20,000 document writes per day</strong></li>
                    <li><strong>1 GB stored data</strong></li>
                  </ul>
                  <p className="text-[11px] text-emerald-600 font-medium mt-2">
                    ✓ With 100 students accessing 10 classes a day, you will use less than 3,000 reads/day. You will stay well under 10% of the free quota!
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">2. Video Hosting (OBS Recordings)</h4>
                  <p className="text-xs text-slate-600 mb-2">Do not store video files in Firestore database.</p>
                  <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
                    <li>Use <strong>YouTube "Unlisted" mode</strong> (Free, unlimited 1080p video streaming).</li>
                    <li>Only people who have the video link (your students logged into this portal) can watch it.</li>
                    <li>Zero bandwidth charges, zero video storage costs.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">3. PDF Study Notes (Note3)</h4>
                  <p className="text-xs text-slate-600 mb-2">Free hosting options:</p>
                  <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
                    <li>Upload Note3 PDF exports to <strong>Google Drive</strong> (15 GB free per account).</li>
                    <li>Set sharing to: "Anyone with the link can view".</li>
                    <li>Paste the link into the Brain Booster Classes portal.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">4. Web Hosting</h4>
                  <p className="text-xs text-slate-600 mb-2">Free deployment platforms:</p>
                  <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
                    <li><strong>Vercel</strong> or <strong>Netlify</strong> (100 GB bandwidth/month free).</li>
                    <li><strong>Firebase Hosting</strong> (10 GB free storage, 360 MB/day free transfer).</li>
                    <li>Free SSL certificates (HTTPS padlock) included automatically.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'obs_note3' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  Publishing OBS Studio Class Recordings
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 pl-1">
                  <li>Finish recording your coaching lecture in <strong>OBS Studio</strong> on your Dell laptop (it saves as an .mp4 in your Videos folder).</li>
                  <li>Go to <a href="https://studio.youtube.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">studio.youtube.com</a> and click <strong>Create → Upload Videos</strong>.</li>
                  <li>
                    In the "Visibility" step, choose <strong>"Unlisted"</strong>.
                    <span className="block text-slate-500 italic mt-0.5">
                      (Important: Do not choose "Public" so the general public cannot search for it, and do not choose "Private" because private restricts YouTube logins. "Unlisted" allows embedded playback only inside your portal!)
                    </span>
                  </li>
                  <li>Copy the YouTube link and open your Brain Booster Classes <strong>Teacher Dashboard → Add Recording</strong>.</li>
                  <li>Select the student class (e.g. Class 10), subject, chapter name, paste the YouTube URL, and click "Publish". All approved students in that class immediately see the video on their dashboard!</li>
                </ol>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Publishing Note3 PDF Handwritten Notes
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 pl-1">
                  <li>In your <strong>Note3</strong> tablet/laptop application, finish writing the chapter notes or formula sheet.</li>
                  <li>Click <strong>Export / Save As → PDF Document</strong>.</li>
                  <li>Upload the PDF to your coaching Google Drive folder (e.g. "Brain Booster Classes Notes").</li>
                  <li>Right-click the PDF in Google Drive → Click <strong>Share → Anyone with the link can view</strong> → Copy link.</li>
                  <li>In the Teacher Dashboard, click <strong>Add Note / Study Material</strong>, paste the link, choose the class & subject, and save!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <strong>Practical Verification Checklist:</strong> Test these two real-world scenarios right now using the <em>"Test Role Preview"</em> switcher at the top of the screen:
              </div>

              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">Scenario A</span>
                    Pending Student Account (Not Yet Approved)
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">
                    1. Click "Test: Pending Student" in the top bar (or register a new student account).<br />
                    2. Notice the screen displays the "Registration Pending Approval" security banner.<br />
                    3. The student <strong>cannot</strong> browse any recordings, notes, or homework until the teacher explicitly reviews and approves them.<br />
                    4. Security rules strictly block direct read attempts from the database.
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Scenario B</span>
                    Approved Class 10 Student
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">
                    1. Click "Test: Approved Student (Class 10)".<br />
                    2. The student sees only materials assigned to Class 10 (Mathematics, Science, etc.).<br />
                    3. They can submit homework with written answers and links.<br />
                    4. They <strong>cannot</strong> see drafts or materials from Class 11/12.<br />
                    5. They cannot promote their own account to Teacher/Admin.
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">Scenario C</span>
                    Teacher & Admin Full Control
                  </h4>
                  <p className="text-xs text-slate-600">
                    1. Switch to "Test: Teacher / Admin" (or log in with brainboosterclasses4@gmail.com).<br />
                    2. See student approval queue with One-Click Approve / Reject & Class Reassignment.<br />
                    3. Review homework submissions, enter marks (e.g. 23/25), write constructive feedback, and return.<br />
                    4. Publish, edit, and unpublish OBS recordings and Note3 PDF notes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">How to Put Brain Booster Classes Live on the Web (Free)</h3>
              <p className="text-xs text-slate-600">
                You can host your website completely free with Vercel or Firebase Hosting so your students can access it from their Android phones anywhere in the world:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Option 1: Deploy with Vercel (Easiest - 2 minutes)</h4>
                  <ol className="list-decimal list-inside text-xs space-y-1 text-slate-700">
                    <li>Create a free account on <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">vercel.com</a></li>
                    <li>Push your code to GitHub (or drag & drop your project folder).</li>
                    <li>Click "Deploy". Vercel generates your free custom HTTPS address (e.g. <code className="bg-white px-1 py-0.5 rounded text-blue-600 font-mono">brain-booster-classes.vercel.app</code>).</li>
                  </ol>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Option 2: Deploy with Firebase Hosting</h4>
                  <div className="space-y-2 mt-2">
                    <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono">npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Need help? We're with you at every step!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Got it, Let's Continue!
          </button>
        </div>
      </div>
    </div>
  );
};
