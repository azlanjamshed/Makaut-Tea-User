import React from "react";
import MobileHeader from "../../components/navigation/MobileHeader";
import {
  HelpCircle,
  KeyRound,
  FileText,
  AlertTriangle,
  MessageCircle,
  Scroll,
  Shield,
  Info,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const HELP_CARDS = [
  {
    to: "/profile/edit",
    icon: KeyRound,
    title: "Account & Security",
    desc: "Update semester, profile picture, name, or password credentials.",
    badge: "Account",
  },
  {
    to: "/rules",
    icon: Scroll,
    title: "House Rules",
    desc: "The eight core principles for posting and respectful campus expression.",
    badge: "Rules",
  },
  {
    to: "/faq",
    icon: HelpCircle,
    title: "Frequently Asked Questions",
    desc: "Instant answers to common questions about posting, privacy, and reports.",
    badge: "FAQ",
  },
  {
    to: "/privacy",
    icon: Shield,
    title: "Privacy & Anonymity",
    desc: "See exactly how anonymous posts look and how your data is safeguarded.",
    badge: "Privacy",
  },
  {
    to: "/reporting-guide",
    icon: AlertTriangle,
    title: "Reporting Guide",
    desc: "When to report content, what moderators review, and what not to report.",
    badge: "Safety",
  },
  {
    to: "/feedback",
    icon: MessageCircle,
    title: "Contact / Suggestion Box",
    desc: "Submit bug reports, feature suggestions, or direct notes to the team.",
    badge: "Feedback",
  },
  {
    to: "/guidelines",
    icon: FileText,
    title: "Community Guidelines",
    desc: "Quick overview of what is allowed, cautioned, and strictly prohibited.",
    badge: "Conduct",
  },
  {
    to: "/about",
    icon: Info,
    title: "About Makau-Tea",
    desc: "Why this platform exists and how it is built for campus students.",
    badge: "About",
  },
];

const HelpSupportPage = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="Help & Support" showBack />

      <main className="px-4 py-4 space-y-6">
        {/* Hero Section */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-6 space-y-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                How can we help?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Explore guides, community policies, and support channels.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            Need assistance with your account, curious about how anonymous
            masking functions, or want to report an issue? You're in the right
            place.
          </p>
        </div>

        {/* Categorized Hub Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {HELP_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="p-5 rounded-3xl bg-white border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all flex flex-col justify-between group hover:shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-[var(--border-color)] flex items-center justify-center text-[var(--color-primary)]">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 px-2.5 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900 font-display group-hover:text-[var(--color-primary)] transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)]">
                  <span>Open guide</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Guidelines Card */}
        <div className="p-6 rounded-3xl bg-white border border-[var(--border-color)] space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>The 3-Second Golden Rule</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Vent about tests, bad food, tough attendance, parking, or professors
            generally.
            <strong> Do not</strong> post private phone numbers, hostel room
            numbers, or personally malicious defamatory harassment targeting
            individuals.
          </p>
          <div className="pt-2">
            <Link
              to="/rules"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              <span>Read the 8 House Rules</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpSupportPage;
