import React from "react";
import MobileHeader from "../../components/navigation/MobileHeader";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowDown,
  ShieldCheck,
  Flag,
  EyeOff,
  Ban,
  Check,
  X,
} from "lucide-react";

const ReportingGuidePage = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="Reporting Guide" showBack backUrl="/help" />

      <main className="px-4 py-4 space-y-6">
        {/* Hero Section */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                See something that shouldn't be here?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                How content reporting and moderation works on Makau-Tea.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our campus community relies on students helping keep discussions
            safe, relevant, and free of toxicity. Here is your definitive guide
            to reporting inappropriate content.
          </p>
        </div>

        {/* When to Report vs When NOT to Report */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Green: When to report */}
          <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm font-display">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Report it if you see:</span>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <strong>Targeted Harassment</strong> or persistent bullying
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <strong>Spam</strong>, referral codes, or automated flood
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <strong>Personal info (Doxxing)</strong>, phone numbers,
                  addresses
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <strong>Violent threats</strong> or self-harm content
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <strong>NSFW / Explicit</strong> unconsented media
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span>Other severe House Rule violations</span>
              </li>
            </ul>
          </div>

          {/* Red: When NOT to report */}
          <div className="p-5 rounded-3xl bg-rose-50/60 border border-rose-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm font-display">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>DO NOT report because:</span>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 text-rose-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <em>"I disagree with this opinion."</em>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 text-rose-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <em>"This person likes a different professor or club."</em>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 text-rose-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <em>"This rant hurt my feelings, but violates no rules."</em>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 text-rose-600 font-bold shrink-0 mt-0.5" />
                <span>
                  <em>"I just don't like the person posting it."</em>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 text-rose-600 font-bold shrink-0 mt-0.5" />
                <span>As a personal dislike or downvote button</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Transparent Workflow Diagram */}
        <div className="p-6 rounded-3xl bg-white border border-[var(--border-color)] space-y-5 shadow-sm">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              What happens after you report?
            </h2>
            <p className="text-xs text-slate-500">
              Transparent, accountable, step-by-step resolution.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 max-w-sm mx-auto">
            {/* Step 1 */}
            <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  You submit a report
                </span>
                <span className="text-[11px] text-slate-500">
                  Via the post or comment menu (⋮)
                </span>
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 2 */}
            <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Report sent to Moderator Queue
                </span>
                <span className="text-[11px] text-slate-500">
                  Real-time alert in Admin Control Center
                </span>
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 3 */}
            <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Moderators review the context
                </span>
                <span className="text-[11px] text-slate-500">
                  Evaluated against the House Rules
                </span>
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 4 */}
            <div className="w-full p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 block">
                  Action taken if necessary
                </span>
                <span className="text-[11px] text-slate-500">
                  Content hidden, deleted, or account suspended
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How to report tip */}
        <div className="p-4 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center gap-3 text-xs text-slate-800 shadow-xs">
          <Flag className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
          <span>
            To report any rant or comment, tap the{" "}
            <strong>three dots (⋮)</strong> in the top-right corner of the card,
            select <strong>"Report"</strong>, and pick the matching violation
            reason.
          </span>
        </div>
      </main>
    </div>
  );
};

export default ReportingGuidePage;
