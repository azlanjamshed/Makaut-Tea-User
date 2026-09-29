import React, { useState } from 'react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'What is Rant?',
    a: 'Rant is an unofficial student platform where students can share their thoughts, frustrations, funny experiences, and opinions about college life in a dedicated, supportive campus space.',
    category: 'General',
  },
  {
    q: 'Can I post anonymously?',
    a: 'Yes! When creating a rant or writing a comment/reply, you can toggle the "Post anonymously" checkbox. Your real name, avatar, and email will be hidden and replaced with an anonymous identity (e.g. "Anonymous Student" or an alias).',
    category: 'Posting',
  },
  {
    q: 'Can I edit my rant?',
    a: 'Yes. You can edit your own rant at any time by clicking the three-dots (⋮) menu on your post and selecting "Edit".',
    category: 'Posting',
  },
  {
    q: 'Can I delete my rant?',
    a: 'Yes. You can delete your own rant whenever you wish from the three-dots (⋮) options menu. Deletion removes the rant and its comments.',
    category: 'Posting',
  },
  {
    q: 'Can I post a picture?',
    a: 'Yes, if the post and photo comply with our community rules (no NSFW, no private screenshots with personal information, no copyrighted harassment material).',
    category: 'Posting',
  },
  {
    q: 'Can I rant about a professor?',
    a: 'You can discuss classes, teaching experiences, grading policies, and college-related academic situations. However, you must NOT use the platform for targeted personal harassment, threats, slurs, or exposing private contact details or personal phone numbers.',
    category: 'Moderation',
  },
  {
    q: 'Can I rant about another student?',
    a: 'You can share your general campus experience, but do not expose personal private information (doxxing), post private chat screenshots, or use the platform to bully or harass someone.',
    category: 'Moderation',
  },
  {
    q: 'Who can see my anonymous rant?',
    a: 'Other campus students can view your rant on the public feed, but your public identity (name, email, profile photo) is completely masked and never shown on the card.',
    category: 'Privacy',
  },
  {
    q: 'What happens when I report something?',
    a: 'The report is instantly sent to the platform moderators for review. Our moderation team assesses the reported content against our House Rules and will hide, restrict, or take disciplinary action if a violation has occurred.',
    category: 'Moderation',
  },
  {
    q: 'Can I report something because I don\'t like it?',
    a: 'No. Disagreement or having a different opinion is not a rule violation. The report tool is strictly reserved for spam, hate speech, harassment, doxxing, and offensive violations.',
    category: 'Moderation',
  },
  {
    q: 'Can I delete my account?',
    a: 'Yes. You can manage or delete your account through your profile settings section.',
    category: 'Account',
  },
  {
    q: 'Who runs Rant?',
    a: 'Rantea is built and maintained by independent student developers and university campus contributors passionate about open, healthy student discourse.',
    category: 'General',
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState('');

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="Frequently Asked Questions" showBack backUrl="/help" />

      <main className="px-4 py-4 space-y-6">
        {/* Hero Section */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center justify-center text-2xl shrink-0">
              ❓
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Got Questions?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Answers to everything you need to know about Rantea.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative pt-2">
            <Search className="absolute left-3.5 top-5 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full bg-slate-50 border border-[var(--border-color)] rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-[var(--border-color)] text-slate-500 text-xs shadow-sm">
              No matching questions found for "{search}".
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[var(--color-primary)] shadow-sm'
                      : 'bg-white border-[var(--border-color)] hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4.5 flex items-center justify-between gap-4 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-lg border border-[var(--color-primary)]/20">
                        {faq.category}
                      </span>
                      <span className="font-bold text-sm sm:text-base text-slate-900 font-display">
                        {faq.q}
                      </span>
                    </div>

                    <div className="text-slate-400 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[var(--color-primary)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[var(--border-color)] bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions card */}
        <div className="p-5 rounded-3xl bg-white border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Still have unanswered questions?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Send your query or suggestion directly to the administration.
            </p>
          </div>
          <Link
            to="/feedback"
            className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold transition-all shrink-0 shadow-xs"
          >
            Ask / Contact Us
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;
