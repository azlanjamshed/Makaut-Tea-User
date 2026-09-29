import React from 'react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityGuidelinesPage = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="Community Guidelines" showBack backUrl="/help" />

      <main className="px-4 py-4 space-y-6">
        {/* Banner */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center justify-center text-2xl shrink-0">
              📢
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Community Guidelines
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                A quick-reference guide to what's encouraged, cautioned, and prohibited.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            These guidelines help everyone know what to expect and keep our platform open, authentic, and safe.
          </p>
        </div>

        {/* 3 Categories: Allowed, Think Twice, Not Allowed */}
        <div className="space-y-4">
          {/* Green: Allowed */}
          <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base font-display">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                🟢
              </span>
              <span>Allowed & Encouraged</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Funny college stories & memes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Student opinions & debates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Canteen & campus complaints</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Academic & exam frustrations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hostel life realities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>General student experiences</span>
              </li>
            </ul>
          </div>

          {/* Yellow: Think twice */}
          <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base font-display">
              <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">
                🟡
              </span>
              <span>Think Twice (Proceed with caution)</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Naming specific individuals</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Posting chat screenshots</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Sensitive private disputes</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Unverified viral allegations</span>
              </li>
            </ul>
            <p className="text-[11px] text-amber-800 pt-1 font-medium">
              Tip: Vent about the <em>situation</em> rather than defaming an identifiable person.
            </p>
          </div>

          {/* Red: Not allowed */}
          <div className="p-5 rounded-3xl bg-rose-50/60 border border-rose-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base font-display">
              <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">
                🔴
              </span>
              <span>Strictly Prohibited</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Violent threats or physical harm</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Doxxing (revealing private numbers/addresses)</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Targeted bullying & hate speech</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Spam, ads, bots, & scams</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Unconsented private media</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Malicious scripts or malware links</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Read full rules banner */}
        <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] flex items-center justify-between text-xs text-slate-600 shadow-sm">
          <span>Need complete details on all platform rules?</span>
          <Link to="/rules" className="text-[var(--color-primary)] font-bold hover:underline">
            Read House Rules →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CommunityGuidelinesPage;
