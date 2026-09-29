import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bell, HelpCircle } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import appLogo from '../../assets/logo.png';
import { scrollToTopAndRefreshFeed } from '../../utils/helpers';

const MobileHeader = ({
  title,
  showBack = false,
  backUrl,
  rightAction,
  unreadCount = 0,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-header pt-safe">
      <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl active:bg-slate-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display truncate">
              {title}
            </h1>
          </div>
        ) : (
          <Link
            to="/"
            onClick={scrollToTopAndRefreshFeed}
            className="flex items-center gap-2.5 group select-none"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-[var(--border-color)] group-hover:scale-105 transition-transform bg-white shadow-sm">
              <img src={appLogo} alt="MAKAU-TEA" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">
              MAKAU<span className="text-[var(--color-primary)]">-TEA</span>
            </span>
          </Link>
        )}

        <div className="flex items-center gap-2.5">
          {rightAction ? (
            rightAction
          ) : !showBack ? (
            <>
              <Link
                to="/help"
                className="p-2 text-slate-600 hover:text-slate-900 rounded-xl active:bg-slate-100 transition-colors"
                aria-label="Help and rules"
                title="Help & Rules"
              >
                <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
              </Link>
              <Link
                to="/notifications"
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl active:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                )}
              </Link>
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                className="active:scale-95 transition-transform"
                aria-label="Profile"
              >
                <Avatar
                  src={user?.image}
                  name={user?.name || 'User'}
                  size="sm"
                  className="ring-2 ring-[var(--border-color)] hover:ring-[var(--color-primary)] transition-all"
                />
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
