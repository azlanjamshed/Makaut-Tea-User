import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Megaphone, ShieldCheck, MessageSquare, Image, Sparkles, ChevronRight, Clock } from 'lucide-react';
import * as postsApi from '../../api/posts';
import appLogo from '../../assets/logo.png';
import { timeAgo, formatCount, resolveImageUrl } from '../../utils/helpers';

const DesktopTrendingWidget = () => {
  const [hottestPost, setHottestPost] = useState(null);
  const [recentOfficialPosts, setRecentOfficialPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchWidgetData = async () => {
      try {
        setIsLoading(true);
        const [trendingRes, officialRes] = await Promise.all([
          postsApi.getTrendingPosts({ timeframe: 'today', limit: 10, sortBy: 'reactions' }),
          postsApi.getRecentOfficialPosts({ hours: 24, limit: 4 }),
        ]);

        if (isMounted) {
          // Section 1: Post with the most likes / reactions today
          if (trendingRes?.success && trendingRes.data && trendingRes.data.length > 0) {
            const sortedByLikes = [...trendingRes.data].sort((a, b) => {
              const countA = a.reactions?.total ?? a.reactionCount ?? 0;
              const countB = b.reactions?.total ?? b.reactionCount ?? 0;
              if (countB !== countA) return countB - countA;
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            // Keep the single top post with the most likes
            setHottestPost(sortedByLikes[0]);
          } else {
            setHottestPost(null);
          }

          // Section 2: Recent posts from admin within last 24 hours
          if (officialRes?.success && officialRes.data) {
            setRecentOfficialPosts(officialRes.data);
          }
        }
      } catch (err) {
        // silently ignore widget errors
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchWidgetData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside
      style={{ overscrollBehavior: 'contain' }}
      className="hidden xl:flex flex-col w-80 2xl:w-96 h-screen sticky top-0 p-4 space-y-4 shrink-0 border-l border-[var(--border-color)] bg-[var(--bg-page)] overflow-y-auto overscroll-contain"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* ========================================================================= */}
      {/* 1. HOT TODAY ON CAMPUS - Top post with most likes                         */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[var(--border-color)] hover:border-amber-300 rounded-3xl p-4 space-y-3 transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider font-mono">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Hot Today on Campus</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 font-mono">
            🔥 #1 Most Liked
          </span>
        </div>

        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Finding top post...</span>
          </div>
        ) : !hottestPost ? (
          <div className="py-3 px-2 text-center text-xs text-slate-500 italic bg-slate-50 rounded-2xl border border-[var(--border-color)]">
            No trending rants yet today. Be the first to react and ignite the campus buzz!
          </div>
        ) : (
          <Link
            to={`/rants/${hottestPost.id || hottestPost._id}`}
            className="block p-3 rounded-2xl bg-slate-50 border border-[var(--border-color)] hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
          >
            {/* Author & Target Row */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
              <div className="flex items-center gap-1.5 truncate pr-2">
                {hottestPost.isOfficial || hottestPost.isAdminPost || hottestPost.user?.role === 'admin' ? (
                  <span className="font-bold text-[var(--color-primary)] truncate">
                    Head of MAKAU-TEA Affairs 📢
                  </span>
                ) : (
                  <span className="font-semibold text-slate-900 truncate">
                    {hottestPost.isAnonymous ? 'Anonymous' : hottestPost.user?.name || 'Student'}
                  </span>
                )}
                {(hottestPost.semester || hottestPost.department) && (
                  <span className="text-slate-500 text-[10px] shrink-0">
                    · {hottestPost.semester || hottestPost.department}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                {timeAgo(hottestPost.createdAt)}
              </span>
            </div>

            {/* Post Snippet */}
            <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed group-hover:text-slate-900 transition-colors font-sans">
              "{hottestPost.text}"
            </p>

            {/* Optional Attached Media Preview Thumbnail */}
            {hottestPost.image && (
              <div className="mt-2.5 rounded-xl overflow-hidden max-h-24 bg-slate-100 border border-[var(--border-color)] flex items-center justify-center">
                <img
                  src={resolveImageUrl(hottestPost.image)}
                  alt="Hot post visual"
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}

            {/* Reaction Summary Bar */}
            <div className="mt-3 pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2 font-bold">
                <span className="px-2 py-0.5 rounded-lg bg-amber-100/80 border border-amber-200 text-amber-900">
                  🔥 {formatCount(hottestPost.reactions?.total || 0)} Likes
                </span>
                <span className="text-slate-500 text-[10px] font-normal flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  {hottestPost.commentsCount || 0}
                </span>
              </div>
              <span className="text-amber-800 font-bold group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">
                Read <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. RECENT POSTS FROM ADMIN (LAST 24 HOURS)                                 */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[var(--border-color)] rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider font-mono">
            <Megaphone className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Head of MAKAU-TEA Affairs</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-mono flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            24h Recent
          </span>
        </div>

        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Checking announcements...</span>
          </div>
        ) : recentOfficialPosts.length === 0 ? (
          <div className="py-3 px-3 text-center text-xs text-slate-500 italic bg-slate-50 rounded-2xl border border-[var(--border-color)]">
            No official broadcasts in the last 24 hours. Campus affairs are running normally! ✨
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentOfficialPosts.map((post) => (
              <Link
                key={post.id || post._id}
                to={`/rants/${post.id || post._id}`}
                className="block p-3 rounded-2xl bg-slate-50 border border-[var(--border-color)] hover:border-[var(--color-primary)] hover:bg-slate-100/70 transition-all group"
              >
                {/* Meta Top: Semester + Time */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/20">
                    {post.semester || post.department || 'All Semesters'}
                  </span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>

                {/* Announcement Text */}
                <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed group-hover:text-[var(--color-primary)] transition-colors font-sans">
                  {post.text}
                </p>

                {/* Footer Details: Image indicator + Interactions */}
                <div className="mt-2 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <div className="flex items-center gap-2">
                    {post.image && (
                      <span className="inline-flex items-center gap-1 text-[var(--color-primary)]">
                        <Image className="w-3 h-3" />
                        <span>Photo</span>
                      </span>
                    )}
                    <span>🔥 {post.reactions?.total || 0}</span>
                    <span>💬 {post.commentsCount || 0}</span>
                  </div>
                  <span className="text-[var(--color-primary)] text-[10px] group-hover:translate-x-0.5 transition-transform flex items-center font-bold">
                    Notice <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. CAMPUS VERIFICATION & NOTICE CARD                                     */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[var(--border-color)] rounded-3xl p-4 text-xs text-slate-500 space-y-2.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-[var(--border-color)] bg-slate-50">
            <img src={appLogo} alt="MAKAU-TEA" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-slate-900 font-bold block text-xs">MAKAU-TEA Community</span>
            <span className="text-[10px] text-[var(--color-primary)] font-medium">Campus discourse & rants</span>
          </div>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          The verified confession & grievance board for campus students. Vent safely, connect anonymously, and share honest thoughts.
        </p>
        <div className="pt-2 text-[10px] text-slate-400 border-t border-[var(--border-color)] flex justify-between font-mono">
          <span>MAKAU-TEA v1.0</span>
          <span>Your safe space</span>
        </div>
      </div>
    </aside>
  );
};

export default DesktopTrendingWidget;
