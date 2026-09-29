import React from 'react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { Scroll, Sparkles, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const RULES = [
  {
    num: 1,
    title: 'Rant freely',
    emoji: '🗣️',
    border: 'border-amber-200',
    body: (
      <div className="space-y-1.5 text-slate-600">
        <p>College is stressful.</p>
        <p>Exams are stressful.</p>
        <p>Attendance is stressful.</p>
        <p>Sometimes your 8 AM class is personally attacking you.</p>
        <p className="font-semibold text-amber-800 pt-1">You're allowed to talk about it.</p>
      </div>
    ),
  },
  {
    num: 2,
    title: "Don't be a menace",
    emoji: '💀',
    border: 'border-rose-200',
    body: (
      <div className="space-y-1.5 text-slate-600">
        <p>Rant about situations, experiences and college problems.</p>
        <p className="font-semibold text-rose-700 pt-1">
          Don't use the platform to threaten, stalk, bully or harass someone.
        </p>
      </div>
    ),
  },
  {
    num: 3,
    title: 'Privacy exists',
    emoji: '🕵️',
    border: 'border-sky-200',
    body: (
      <div className="space-y-1.5 text-slate-600">
        <p className="font-medium text-slate-800 mb-1">Never share or expose:</p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs sm:text-sm pl-1">
          <li>Phone numbers</li>
          <li>Home addresses</li>
          <li>Passwords</li>
          <li>Private documents & ID cards</li>
          <li>Private conversations & personal screenshots</li>
          <li>Personally identifiable sensitive data</li>
        </ul>
      </div>
    ),
  },
  {
    num: 4,
    title: "Anonymous doesn't mean anything goes",
    emoji: '👀',
    border: 'border-purple-200',
    body: (
      <p className="text-slate-600 leading-relaxed">
        Your identity may be hidden publicly, but anonymity isn't a license to abuse, defame, or intimidate people.
      </p>
    ),
  },
  {
    num: 5,
    title: "The report button isn't a dislike button",
    emoji: '🚨',
    border: 'border-red-200',
    body: (
      <div className="space-y-1.5 text-slate-600">
        <p>Don't report something simply because you disagree with it or dislike the author's viewpoint.</p>
        <p className="font-mono text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200 mt-1">
          "I don't like this opinion" ≠ "This violates the rules."
        </p>
      </div>
    ),
  },
  {
    num: 6,
    title: 'No spam',
    emoji: '🤖',
    border: 'border-emerald-200',
    body: (
      <div className="space-y-1.5 text-slate-600">
        <p className="font-medium text-slate-800">Don't flood the platform with:</p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs sm:text-sm pl-1">
          <li>Repeated or duplicate rants</li>
          <li>Promotional content, ads or referral links</li>
          <li>Fake artificial engagement or bots</li>
          <li>Automated posts or scraping scripts</li>
        </ul>
      </div>
    ),
  },
  {
    num: 7,
    title: 'Keep it college-related',
    emoji: '🏫',
    border: 'border-cyan-200',
    body: (
      <div className="space-y-1.5 text-slate-600">
        <p>This is a place specifically built for our campus and college community.</p>
        <p className="font-semibold text-cyan-800 pt-1">
          Keep the majority of your content relevant to student life, academics, hostel, campus buzz and campus culture.
        </p>
      </div>
    ),
  },
  {
    num: 8,
    title: 'Common sense wins',
    emoji: '🧠',
    border: 'border-indigo-200',
    body: (
      <div className="space-y-1 text-slate-600">
        <p>If you have to ask:</p>
        <p className="italic text-slate-800 font-serif">"Is this probably a bad idea?"</p>
        <p className="font-bold text-indigo-700 pt-1">It probably is.</p>
      </div>
    ),
  },
];

const HouseRulesPage = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="House Rules" showBack backUrl="/help" />

      <main className="px-4 py-4 space-y-6">
        {/* Header Hero Banner */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center justify-center text-2xl shrink-0">
              📜
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                The House Rules
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                The unwritten (now written) code of conduct for Rantea.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We built Rant so students have a real, unfiltered outlet for campus reality.
            To keep this sanctuary running and safe for everyone, please respect these eight simple rules.
          </p>
        </div>

        {/* Rule Cards */}
        <div className="space-y-4">
          {RULES.map((rule) => (
            <div
              key={rule.num}
              className={`p-5 rounded-3xl bg-white border ${rule.border} space-y-3 transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-700">
                    #{rule.num}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                    Rule #{rule.num} — {rule.title}
                  </h2>
                </div>
                <span className="text-2xl">{rule.emoji}</span>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed pl-1">
                {rule.body}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Guidelines & Help */}
        <div className="p-5 rounded-3xl bg-white border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Have questions about moderation?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Read our Reporting Guide or see Community Guidelines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/reporting-guide"
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-[var(--border-color)] hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors"
            >
              Reporting Guide
            </Link>
            <Link
              to="/guidelines"
              className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Guidelines
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HouseRulesPage;
