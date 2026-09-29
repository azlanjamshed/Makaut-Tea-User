import React from 'react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { ShieldCheck, Eye, EyeOff, Lock, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="Privacy & Anonymity" showBack backUrl="/help" />

      <main className="px-4 py-4 space-y-6">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center justify-center text-2xl shrink-0">
              🛡️
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Privacy & Anonymity
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Understanding how your identity is protected on Rantea.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Anonymity is a cornerstone of this platform. It allows honest discussion without fear of judgment.
            Here is a crystal-clear breakdown of how identity privacy works and your responsibilities.
          </p>
        </div>

        {/* Section 1: What others see */}
        <div className="p-5 rounded-3xl bg-white border border-[var(--border-color)] space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm sm:text-base font-display">
            <Eye className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-slate-900">Section 1 — What Others See</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When you register, you provide your name, college email, semester, and department.
            Here is how your information is partitioned:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-mono uppercase">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Publicly Visible</span>
              </span>
              <p className="text-xs text-slate-600">
                Your name and avatar (only on non-anonymous posts), department / semester tag, and post text.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 font-mono uppercase">
                <Lock className="w-4 h-4 text-rose-600" />
                <span>Always Hidden / Private</span>
              </span>
              <p className="text-xs text-slate-600">
                Your email address, hashed passwords, internal student IDs, and raw device identifiers are never exposed publicly.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Anonymous Posts Comparison */}
        <div className="p-5 rounded-3xl bg-white border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm sm:text-base font-display">
            <EyeOff className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-slate-900">Section 2 — Anonymous Posts Side-by-Side</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When you check "Post anonymously", your real profile avatar and name are detached from the post on student feeds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Normal Post Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Standard Public Post
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
                  Public
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Azlan · IT</span>
                  <span className="text-[10px] text-slate-500">2h ago</span>
                </div>
              </div>

              <p className="text-xs text-slate-800 italic bg-white p-2.5 rounded-xl border border-[var(--border-color)]">
                "That 8 AM exam was brutally unfair."
              </p>
            </div>

            {/* Anonymous Post Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--color-primary)]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] font-mono">
                  Anonymous Post
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  🎭 Masked
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm border border-slate-300">
                  🎭
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Anonymous Student · IT</span>
                  <span className="text-[10px] text-slate-500">2h ago</span>
                </div>
              </div>

              <p className="text-xs text-slate-800 italic bg-white p-2.5 rounded-xl border border-[var(--border-color)]">
                "That 8 AM exam was brutally unfair."
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: What not to post */}
        <div className="p-5 rounded-3xl bg-white border border-rose-200 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm sm:text-base font-display">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Section 3 — What NEVER to Post</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Even when posting anonymously, you must never share:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-2">
              <span className="text-rose-600 font-bold">✕</span> Passwords or login credentials
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-2">
              <span className="text-rose-600 font-bold">✕</span> Personal phone numbers
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-2">
              <span className="text-rose-600 font-bold">✕</span> Home or hostel room addresses
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-2">
              <span className="text-rose-600 font-bold">✕</span> Private ID cards / registration cards
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-2">
              <span className="text-rose-600 font-bold">✕</span> Leaked personal chat screenshots
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-2">
              <span className="text-rose-600 font-bold">✕</span> Medical or financial records
            </div>
          </div>
        </div>

        {/* Section 4: Honest Disclaimer */}
        <div className="p-5 rounded-3xl bg-white border border-amber-200 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base font-display">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Section 4 — Important Transparency Disclaimer</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We believe in honest transparency. While other students and viewers cannot see your identity on anonymous posts:
          </p>

          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 pl-1 leading-relaxed">
            <li>
              System databases store associated records to prevent illegal activity, severe physical harm threats, or platform sabotage.
            </li>
            <li>
              In severe cases involving criminal bomb threats, severe harassment, or legal court orders, internal logs may be subpoenaed by law enforcement.
            </li>
            <li>
              Anonymity protects your social standing and student expression—it is <strong>never</strong> a legal shield for hate crimes or illegal threats.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
