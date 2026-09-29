import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home,
  Flame,
  Search,
  Bell,
  User,
  Heart,
  FileText,
  Plus,
  LogOut,
  Megaphone,
  HelpCircle,
} from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import appLogo from "../../assets/logo.png";
import { scrollToTopAndRefreshFeed } from "../../utils/helpers";

const DesktopSidebar = ({ onOpenCreate, unreadCount = 0 }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    { to: "/", label: "Home Feed", icon: Home, end: true },
    { to: "/trending", label: "Trending Rants", icon: Flame },
    { to: "/search", label: "Explore & Search", icon: Search },
    {
      to: "/notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount,
    },
    {
      to: "/announce",
      label: "Campus Broadcast",
      icon: Megaphone,
      requiresAuth: true,
    },
    {
      to: "/help",
      label: "Help & Support",
      icon: HelpCircle,
    },
    {
      to: isAuthenticated ? "/profile" : "/login",
      label: isAuthenticated ? "My Profile" : "Sign In",
      icon: User,
    },
  ];

  return (
    <aside
      style={{
        backgroundColor: "var(--bg-sidebar)",
        overscrollBehavior: "contain",
      }}
      className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-white/15 p-5 justify-between shrink-0 text-white overflow-y-auto overscroll-contain"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Top Logo */}
      <div className="space-y-6">
        <Link
          to="/"
          onClick={scrollToTopAndRefreshFeed}
          className="flex items-center gap-3 px-1 group"
        >
          <div className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition-transform bg-white/10">
            <img
              src={appLogo}
              alt="MAKAU-TEA"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-display block leading-tight">
              MAKAU<span className="text-gray-900">-TEA</span>
            </span>
            <span className="text-[10px] text-white/70 font-medium tracking-tight">
              Campus discourse & rants
            </span>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={
                  link.to === "/" ? scrollToTopAndRefreshFeed : undefined
                }
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-white/20 text-white border border-white/20 font-bold"
                      : "text-white/75 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-display">{link.label}</span>
                </div>
                {link.badge > 0 && (
                  <span className="bg-white text-[var(--color-primary)] text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Create Post Action Button */}
        <button
          onClick={onOpenCreate}
          className="w-full py-3.5 px-4 rounded-2xl bg-white text-[var(--color-primary)] hover:bg-white/90 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>Spill The Tea</span>
        </button>
      </div>

      {/* Bottom section: Help & Support + Profile footer */}
      <div className="space-y-3">
        <Link
          to="/help"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base group-hover:scale-110 transition-transform">
              🆘
            </span>
            <span className="font-display">Help & Support</span>
          </div>
          <span className="text-[10px] text-white/90 font-mono bg-white/15 border border-white/25 px-2 py-0.5 rounded-full font-bold">
            Rules & FAQ
          </span>
        </Link>

        {/* User profile footer */}
        {isAuthenticated && user ? (
          <div className="pt-3 border-t border-white/15 flex items-center justify-between">
            <Link
              to="/profile"
              className="flex items-center gap-3 overflow-hidden flex-1 group"
            >
              <Avatar
                src={user.image}
                name={user.name}
                size="sm"
                className="ring-2 ring-white/30 group-hover:ring-white/60 transition-all"
              />
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate font-display">
                  {user.name}
                </span>
                <span className="text-[11px] text-white/70 block truncate">
                  {user.department || user.anonymousUsername || "Student"}
                </span>
              </div>
            </Link>
            <button
              onClick={logout}
              className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/15 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pt-3 border-t border-white/15">
            <Link to="/login">
              <button className="w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20">
                Sign In to Post
              </button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
