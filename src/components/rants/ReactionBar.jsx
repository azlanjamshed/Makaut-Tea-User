import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Eye } from "lucide-react";
import { REACTIONS } from "../../utils/constants";
import { formatCount } from "../../utils/helpers";

const ReactionBar = ({
  reactions = { counts: {}, total: 0, userReaction: null },
  onReact,
  commentsCount = 0,
  views = 0,
  onCommentClick,
  disabled = false,
  className = "",
}) => {
  const counts = reactions.counts || {};
  const userReaction = reactions.userReaction;

  const reactionColorClasses = {
    "❤️": "hover:bg-rose-50 text-rose-800 border-rose-200",
    "💩": "hover:bg-amber-50 text-amber-800 border-amber-200",
    "💀": "hover:bg-purple-50 text-purple-800 border-purple-200",
  };

  const activeReactionClasses = {
    "❤️": "bg-rose-100 text-rose-900 border-rose-300 font-bold shadow-sm",
    "💩": "bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-sm",
    "💀": "bg-purple-100 text-purple-900 border-purple-300 font-bold shadow-sm",
  };

  return (
    <div
      className={`flex items-center justify-between gap-1.5 pt-3 border-t border-[var(--border-color)] ${className}`}
    >
      {/* Reaction Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {REACTIONS.map(({ emoji }) => {
          const isSelected = userReaction === emoji;
          const count = counts[emoji] || 0;

          return (
            <motion.button
              key={emoji}
              type="button"
              disabled={disabled}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                onReact?.(emoji);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition-all select-none ${
                isSelected
                  ? activeReactionClasses[emoji]
                  : `bg-slate-50 border-[var(--border-color)] text-slate-700 ${reactionColorClasses[emoji]}`
              }`}
              title={`React with ${emoji}`}
            >
              <span className="text-sm leading-none">{emoji}</span>
              {count > 0 && (
                <span className="tabular-nums font-semibold">
                  {formatCount(count)}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Stats: Comments and Views */}
      <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick?.();
          }}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Comments"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="tabular-nums font-medium">
            {formatCount(commentsCount)}
          </span>
        </button>

        <div
          className="inline-flex items-center gap-1 px-1 py-1 text-slate-400"
          title="Views"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="tabular-nums">{formatCount(views)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReactionBar;
