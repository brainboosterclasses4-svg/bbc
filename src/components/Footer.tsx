import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Shield, HelpCircle, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenGuide }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="text-white font-extrabold text-sm font-heading">
                Brain Booster Classes
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Empowering students from Class 6 to Class 12 with conceptual clarity, OBS recorded video lectures, Note3 handwritten formula sheets, and interactive homework reviews.
            </p>
          </div>

          {/* Academic Classes */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Academic Classes</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Class 6 to 8: Foundation & Conceptual Mastery</li>
              <li>Class 9 & 10: Board Intensive & Mathematics/Science</li>
              <li>Class 11 & 12: Physics, Chemistry & Mathematics</li>
              <li className="text-blue-400">Custom batches & doubt sessions</li>
            </ul>
          </div>

          {/* Coaching Contact & Support (Editable) */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Contact & Faculty Support</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-300 font-mono">brainboosterclasses4@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+91 98765 43210 (Helpline)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Coaching Center & Online Digital Studio</span>
              </li>
            </ul>
          </div>

          {/* Technical & Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Help & Transparency</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-white transition flex items-center gap-1.5 text-blue-400"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Dell Laptop & Zero Cost Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Policy & Student Safety</span>
                </button>
              </li>
              <li className="text-slate-500">
                Architecture: React • Cloud Firestore • OBS Studio • Note3 PDF
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Brain Booster Classes. All rights reserved. Built for coaching excellence.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Free Tier Optimized: 0 Ongoing Hosting Costs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
