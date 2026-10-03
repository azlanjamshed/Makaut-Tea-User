import React from "react";
import MobileHeader from "../../components/navigation/MobileHeader";
import {
  Info,
  Sparkles,
  Heart,
  Coffee,
  ShieldCheck,
  Flame,
  Scroll,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import appLogo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="About Makau-Tea" showBack backUrl="/help" />

      <main className="px-4 py-4 space-y-6">
        {/* Brand Banner */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-8 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto flex items-center justify-center border border-[var(--border-color)] bg-slate-50">
            <img
              src={appLogo}
              alt="<Makau-Tea>"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Makau<span className="text-[var(--color-primary)]">-Tea</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Your own ranting platform — genuine, anonymous campus heartbeat.
            </p>
          </div>
        </div>

        {/* The Core Manifesto */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[var(--border-color)] space-y-5 shadow-sm">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
            Why does Makau-Tea exist?
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              Because every college has things students want to say, but don't
              always have a place to say them.
            </p>

            <p>
              Makau-Tea is a student-built space for the funny, frustrating,
              confusing, and occasionally ridiculous parts of college life.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] space-y-2 font-medium text-slate-700">
              <p className="flex items-center gap-2 text-rose-600">
                <X className="w-4 h-4 shrink-0 font-bold" /> No polished,
                performative LinkedIn posts.
              </p>
              <p className="flex items-center gap-2 text-rose-600">
                <X className="w-4 h-4 shrink-0 font-bold" /> No pretending
                everything is perfect.
              </p>
              <p className="flex items-center gap-2 text-emerald-600 font-bold">
                <Check className="w-4 h-4 shrink-0 font-bold" /> Just real
                college life.
              </p>
            </div>

            <p>
              Whether it's coping with sudden syllabus shifts, debating canteen
              chai quality, laughing at 8 AM lab schedules, or celebrating
              campus wins—this is your platform.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-[var(--color-primary)]">
              <Sparkles className="w-4 h-4" />
              <span>Built by students, for students.</span>
            </span>
            <span className="font-mono text-slate-500">
              Version 1.0 (Campus Edition)
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/rules"
            className="p-4 rounded-2xl bg-white border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-colors text-center space-y-1.5 group shadow-xs"
          >
            <Scroll className="w-5 h-5 mx-auto text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-slate-800 block group-hover:text-[var(--color-primary)]">
              House Rules
            </span>
          </Link>

          <Link
            to="/feedback"
            className="p-4 rounded-2xl bg-white border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-colors text-center space-y-1.5 group shadow-xs"
          >
            <MessageSquare className="w-5 h-5 mx-auto text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-slate-800 block group-hover:text-[var(--color-primary)]">
              Share Feedback
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
