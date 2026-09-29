import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CommentInput = ({ onSendComment, isSubmitting = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!isAuthenticated) {
      showToast('Please sign in to comment', 'warning');
      return;
    }

    onSendComment?.({ text: text.trim(), isAnonymous });
    setText('');
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[var(--border-color)] px-4 py-3 pb-safe shadow-lg">
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5 max-w-2xl mx-auto">
        <Avatar
          src={isAnonymous ? '' : user?.image}
          name={isAnonymous ? 'Anonymous' : user?.name || 'You'}
          isAnonymous={isAnonymous}
          size="sm"
          className="shrink-0"
        />

        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isAuthenticated
                ? isAnonymous
                  ? 'Comment anonymously...'
                  : 'Add a thought...'
                : 'Sign in to comment...'
            }
            className="w-full bg-slate-50 border border-[var(--border-color)] text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-2xl py-2.5 pl-3.5 pr-11 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-sm"
          />

          {/* Quick Anonymous Toggle Button inside input */}
          <button
            type="button"
            onClick={() => setIsAnonymous((prev) => !prev)}
            className={`absolute right-2 p-1.5 rounded-xl text-xs transition-colors ${
              isAnonymous
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
            }`}
            title={isAnonymous ? 'Posting Anonymously' : 'Post with your profile'}
            aria-label="Toggle anonymous"
          >
            <span className="text-sm">🎭</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="p-2.5 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
          aria-label="Send comment"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentInput;
