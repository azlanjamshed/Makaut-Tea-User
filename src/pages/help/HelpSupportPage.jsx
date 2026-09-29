import React from 'react';
import MobileHeader from '../../components/navigation/MobileHeader';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HELP_CARDS = [
  {
    to: '/profile/edit',
    icon: KeyRound,
    emoji: '🔐',
    title: 'Account & Security',
    desc: 'Update semester, profile picture, name, or password credentials.',
    badge: 'Account',
  },
  {
    to: '/rules',
    icon: Scroll,
    emoji: '📜',
    title: 'House Rules',
    desc: 'The eight core principles for posting and respectful campus expression.',
    badge: 'Rules',
  },
  {
    to: '/faq',
    icon: HelpCircle,
    emoji: '❓',
    title: 'Frequently Asked Questions',
    desc: 'Instant answers to common questions about posting, privacy, and reports.',
    badge: 'FAQ',
  },
  {
    to: '/privacy',
    icon: Shield,
    emoji: '🛡️',
    title: 'Privacy & Anonymity',
    desc: 'See exactly how anonymous posts look and how your data is safeguarded.',
    badge: 'Privacy',
  },
  {
    to: '/reporting-guide',
    icon: AlertTriangle,
    emoji: '🚨',
    title: 'Reporting Guide',
    desc: 'When to report content, what moderators review, and what not to report.',
    badge: 'Safety',
  },
  {
    to: '/feedback',
    icon: MessageCircle,
    emoji: '💬',
    title: 'Contact / Suggestion Box',
    desc: 'Submit bug reports, feature suggestions, or direct notes to the team.',
    badge: 'Feedback',
  },
  {
    to: '/guidelines',
    icon: FileText,
    emoji: '📢',
    title: 'Community Guidelines',
    desc: 'Quick overview of what is allowed, cautioned, and strictly prohibited.',
    badge: 'Conduct',
  },
  {
    to: '/about',
    icon: Info,
    emoji: 'ℹ️',
    title: 'About Rantea',
    desc: 'Why this platform exists and how it is built for campus students.',
    badge: 'About',
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
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center justify-center text-2xl shrink-0">
              🆘
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
            Need assistance with your account, curious about how anonymous masking functions, or want to report an issue? You're in the right place.
          </p>
        </div>

        {/* Categorized Hub Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {HELP_CARDS.map((card) => {
            return (
              <Link
                key={card.to}
                to={card.to}
                className="p-5 rounded-3xl bg-white border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all flex flex-col justify-between group hover:shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{card.emoji}</span>
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

                <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-800">
                  <span className="text-[11px] font-medium">Read guide</span>
                  <ChevronRight className="w-4 h-4 text-[var(--color-primary)] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Suggestion Box Quick Banner */}
        <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Have an idea or suggestion?</span>
            </span>
            <p className="text-xs text-slate-600">
              Submit your feature suggestions directly to the platform administrators.
            </p>
          </div>
          <Link
            to="/feedback"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            Give Suggestion
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HelpSupportPage;
