import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Flame, Plus, Bell, User, HelpCircle, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { scrollToTopAndRefreshFeed } from '../../utils/helpers';

const MobileBottomNav = ({ onOpenCreate, unreadCount = 0 }) => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/trending', label: 'Trending', icon: Flame },
    { to: '/announce', label: 'Broadcast', icon: Megaphone },
    {
      isAction: true,
      label: 'Post',
      icon: Plus,
      onClick: onOpenCreate,
    },
    {
      to: '/help',
      label: 'Help',
      icon: HelpCircle,
    },
    {
      to: '/notifications',
      label: 'Alerts',
      icon: Bell,
      badge: unreadCount,
      requiresAuth: true,
    },
    {
      to: isAuthenticated ? '/profile' : '/login',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md pb-safe border-t border-[var(--border-color)] shadow-lg">
      <div className="flex items-center justify-between h-16 px-1">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key="create-action"
                onClick={item.onClick}
                className="relative -top-3.5 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white active:scale-95 transition-transform border-2 border-white shadow-md shrink-0"
                aria-label="Create Rant"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            );
          }

          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={item.to === '/' ? scrollToTopAndRefreshFeed : undefined}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center flex-1 min-w-0 max-w-[54px] h-full py-1 text-[9px] sm:text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[var(--color-primary)] font-bold' : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-bold text-[9px] min-w-4 h-4 rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 font-display tracking-tight leading-none truncate max-w-full">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
