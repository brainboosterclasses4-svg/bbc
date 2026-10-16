import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  Download,
  HelpCircle,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenGuide }) => {
  const {
    currentUser,
    profile,
    isTeacher,
    isPending,
    isApproved,
    signOutUser,
    testRoleOverride,
    setTestRoleOverride,
  } = useAuth();

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
      }
    } else {
      alert('PWA Installation:\n\n• On Android Chrome: Tap the 3 dots (⋮) in the top right and select "Install app" or "Add to Home screen".\n• On Desktop Chrome/Edge: Click the install icon in the URL address bar.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Test Role Selector Bar for Fast Evaluation */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] text-slate-300">
            Active Role: <strong className="text-white">
              {testRoleOverride
                ? testRoleOverride === 'teacher'
                  ? 'Faculty / Teacher (Test Mode)'
                  : testRoleOverride === 'pending-student'
                  ? 'Pending Student (Test Mode)'
                  : 'Approved Class 10 Student (Test Mode)'
                : isTeacher
                ? 'Teacher / Admin'
                : isPending
                ? 'Pending Student'
                : 'Approved Student'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Switch Role Preview:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTestRoleOverride('teacher')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                testRoleOverride === 'teacher' || (!testRoleOverride && isTeacher)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => setTestRoleOverride('approved-student')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                testRoleOverride === 'approved-student' || (!testRoleOverride && isApproved && !isTeacher)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Class 10 Student
            </button>
            <button
              onClick={() => setTestRoleOverride('pending-student')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                testRoleOverride === 'pending-student' || (!testRoleOverride && isPending)
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Pending Student
            </button>
            {testRoleOverride && (
              <button
                onClick={() => setTestRoleOverride(null)}
                className="px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white underline ml-1"
                title="Reset to real login profile"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-heading block leading-tight">
                Brain Booster Classes
              </span>
              <span className="text-[10px] sm:text-xs text-blue-600 font-semibold tracking-wide uppercase">
                Online Learning Portal
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition border border-slate-200"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Dell Laptop & Free Hosting Guide</span>
            </button>

            {/* PWA Install Button */}
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition border border-blue-200"
              title="Install app on mobile or desktop"
            >
              <Download className="w-4 h-4" />
              <span>Install App (PWA)</span>
            </button>

            {/* Auth / Account Profile Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 max-w-[140px] truncate">
                    {profile?.fullName || currentUser.email}
                  </div>
                  <div className="text-[10px] text-blue-600 font-medium">
                    {profile?.className || (isTeacher ? 'Faculty' : 'Student')}
                  </div>
                </div>

                <button
                  onClick={() => signOutUser()}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="p-2 rounded-lg text-blue-600 bg-blue-50"
              title="Install PWA"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                onOpenGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Dell Laptop & Free Hosting Guide</span>
            </button>

            {currentUser ? (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">{profile?.fullName}</div>
                  <div className="text-[10px] text-slate-500">{profile?.className}</div>
                </div>
                <button
                  onClick={() => signOutUser()}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
