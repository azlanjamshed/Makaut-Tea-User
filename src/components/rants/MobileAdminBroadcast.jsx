import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, ChevronRight, ChevronDown, ChevronUp, Image as ImageIcon, Flame, MessageSquare, Clock } from 'lucide-react';
import * as postsApi from '../../api/posts';
import { timeAgo, formatCount } from '../../utils/helpers';

const MobileAdminBroadcast = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const res = await postsApi.getRecentOfficialPosts({ hours: 24, limit: 5 });
        if (isMounted && res?.success && Array.isArray(res.data)) {
          setAnnouncements(res.data);
        }
      } catch (err) {
        // Silently handle broadcast fetch errors
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  // If loading or no announcements in the last 24h, take 0 vertical space!
  if (isLoading || announcements.length === 0) {
    return null;
  }

  return (
    <section className="xl:hidden w-full transition-all duration-300">
      {/* Top Header Strip */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
          </span>
          <Megaphone className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>Head of MAKAU-TEA Affairs</span>
          <span className="text-[10px] font-normal text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full border border-purple-200">
            24h
          </span>
        </div>

        {/* Collapse / Expand Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-slate-100 transition-colors font-mono cursor-pointer"
          title={isCollapsed ? 'Expand announcements' : 'Collapse view'}
        >
          <span>{isCollapsed ? `Show (${announcements.length})` : 'Hide'}</span>
          {isCollapsed ? (
            <ChevronDown className="w-3 h-3 text-[var(--color-primary)]" />
          ) : (
            <ChevronUp className="w-3 h-3 text-slate-400" />
          )}
        </button>
      </div>

      {/* Collapsed Pill View (Takes barely ~34px) */}
      {isCollapsed ? (
        <div
          onClick={() => setIsCollapsed(false)}
          className="p-2.5 rounded-2xl bg-white border border-[var(--border-color)] flex items-center justify-between text-xs text-slate-700 cursor-pointer hover:border-purple-300 shadow-sm"
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-mono font-bold shrink-0 border border-purple-200">
              {announcements[0]?.semester || 'Official'}
            </span>
            <p className="truncate text-slate-700 text-xs">
              "{announcements[0]?.text}"
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--color-primary)] shrink-0 font-medium flex items-center gap-0.5">
            View <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      ) : (
        /* Compact Horizontal Swipe Track (Only ~80px tall) */
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {announcements.map((post) => (
            <Link
              key={post.id || post._id}
              to={`/rants/${post.id || post._id}`}
              className="snap-center shrink-0 w-[84vw] sm:w-80 p-3 rounded-2xl bg-white border border-[var(--border-color)] hover:border-purple-300 active:scale-[0.99] transition-all group flex flex-col justify-between shadow-sm"
            >
              {/* Top Row: Target Semester badge + Relative timestamp */}
              <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-200">
                  {post.semester || post.department || 'All Semesters'}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                  {timeAgo(post.createdAt)}
                </span>
              </div>

              {/* Announcement Text (Compact 2-line clamp) */}
              <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed group-hover:text-purple-700 transition-colors">
                "{post.text}"
              </p>

              {/* Bottom Row: Photo indicator + Likes/Comments + Read Arrow */}
              <div className="mt-2 pt-1.5 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-2.5">
                  {post.image && (
                    <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-semibold">
                      <ImageIcon className="w-3 h-3" />
                      <span>Photo</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>{formatCount(post.reactions?.total || 0)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    <span>{formatCount(post.commentsCount || 0)}</span>
                  </span>
                </div>
                <span className="text-[var(--color-primary)] font-sans text-[11px] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Read Notice <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default MobileAdminBroadcast;
