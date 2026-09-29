import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import DesktopSidebar from "./components/navigation/DesktopSidebar";
import DesktopTrendingWidget from "./components/navigation/DesktopTrendingWidget";
import MobileBottomNav from "./components/navigation/MobileBottomNav";
import CreateRantSheet from "./components/rants/CreateRantSheet";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RantDetailsPage from "./pages/RantDetailsPage";
import TrendingPage from "./pages/TrendingPage";
import SearchPage from "./pages/SearchPage";
import MyRantsPage from "./pages/MyRantsPage";
import MyReactionsPage from "./pages/MyReactionsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AnnouncePage from "./pages/AnnouncePage";
import NotFoundPage from "./pages/NotFoundPage";
import HouseRulesPage from "./pages/help/HouseRulesPage";
import FaqPage from "./pages/help/FaqPage";
import PrivacyPage from "./pages/help/PrivacyPage";
import ReportingGuidePage from "./pages/help/ReportingGuidePage";
import ContactFeedbackPage from "./pages/help/ContactFeedbackPage";
import AboutPage from "./pages/help/AboutPage";
import CommunityGuidelinesPage from "./pages/help/CommunityGuidelinesPage";
import HelpSupportPage from "./pages/help/HelpSupportPage";
import appLogo from "./assets/logo.png";
import * as notifApi from "./api/notifications";

// Helper to scroll to top on route transition
const ScrollToTop = ({ scrollContainerRef }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [pathname, scrollContainerRef]);
  return null;
};

// Route wrapper that requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-page)] gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--border-color)] flex items-center justify-center shadow-md animate-pulse">
          <img src={appLogo} alt="MAKAU-TEA" className="w-9 h-9 object-contain" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
          <span>Entering MAKAU-TEA...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Route wrapper for public auth pages (login/register) - redirects to home if already authenticated
const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-page)] gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--border-color)] flex items-center justify-center shadow-md animate-pulse">
          <img src={appLogo} alt="MAKAU-TEA" className="w-9 h-9 object-contain" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const mainContentRef = useRef(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editRant, setEditRant] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count for notifications
  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await notifApi.getUnreadCount();
      if (res.success && typeof res.count === "number") {
        setUnreadCount(res.count);
      }
    } catch (err) {
      // silently handle
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshUnreadCount();
    // Poll every 45s for fresh notifications
    const interval = setInterval(refreshUnreadCount, 45000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshUnreadCount]);

  const handleOpenCreate = () => {
    setEditRant(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (rant) => {
    setEditRant(rant);
    setIsCreateOpen(true);
  };

  // Determine if on standalone auth page
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const showChrome = isAuthenticated && !isAuthPage;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-page)] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--border-color)] flex items-center justify-center shadow-md animate-pulse">
          <img src={appLogo} alt="MAKAU-TEA" className="w-10 h-10 object-contain" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
          <span>Starting MAKAU-TEA...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        !showChrome ? "flex justify-center" : "md:h-screen md:overflow-hidden flex"
      } bg-[var(--bg-page)] text-[var(--text-main)] w-full`}
    >
      {/* Scroll restore */}
      <ScrollToTop scrollContainerRef={mainContentRef} />

      {/* Main 3-Column Responsive Shell (Desktop Sidebar | Main Feed | Optional Trending Widget) */}
      <div className="w-full h-full flex justify-between">
        {showChrome && (
          <DesktopSidebar
            onOpenCreate={handleOpenCreate}
            unreadCount={unreadCount}
          />
        )}

        {/* Center Application Viewport */}
        <div
          id="main-viewport"
          ref={mainContentRef}
          className={`flex-1 min-w-0 w-full ${
            showChrome
              ? "min-h-screen md:h-screen md:overflow-y-auto md:overscroll-contain"
              : "min-h-screen"
          } bg-[var(--bg-page)]`}
        >
          <div
            className={`w-full ${
              showChrome
                ? "max-w-2xl mx-auto min-h-full border-x-0 md:border-x border-[var(--border-color)]"
                : "min-h-full"
            }`}
          >
            <Routes>
              {/* Public Auth Pages */}
              <Route
                path="/login"
                element={
                  <PublicAuthRoute>
                    <LoginPage />
                  </PublicAuthRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicAuthRoute>
                    <RegisterPage />
                  </PublicAuthRoute>
                }
              />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage
                      onOpenCreate={handleOpenCreate}
                      onOpenEdit={handleOpenEdit}
                      unreadCount={unreadCount}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rants/:id"
                element={
                  <ProtectedRoute>
                    <RantDetailsPage onOpenEdit={handleOpenEdit} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trending"
                element={
                  <ProtectedRoute>
                    <TrendingPage onOpenEdit={handleOpenEdit} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage onOpenEdit={handleOpenEdit} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-rants"
                element={
                  <ProtectedRoute>
                    <MyRantsPage
                      onOpenCreate={handleOpenCreate}
                      onOpenEdit={handleOpenEdit}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-reactions"
                element={
                  <ProtectedRoute>
                    <MyReactionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/announce"
                element={
                  <ProtectedRoute>
                    <AnnouncePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage onRefreshUnreadCount={refreshUnreadCount} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage onOpenEdit={handleOpenEdit} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <ProfilePage onOpenEdit={handleOpenEdit} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Help, Rules & Support Pages (Protected inside the app) */}
              <Route
                path="/rules"
                element={
                  <ProtectedRoute>
                    <HouseRulesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <ProtectedRoute>
                    <FaqPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <ProtectedRoute>
                    <PrivacyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reporting-guide"
                element={
                  <ProtectedRoute>
                    <ReportingGuidePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <ContactFeedbackPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <ContactFeedbackPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <AboutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guidelines"
                element={
                  <ProtectedRoute>
                    <CommunityGuidelinesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <HelpSupportPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <NotFoundPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>

        {showChrome && <DesktopTrendingWidget />}
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      {showChrome && (
        <MobileBottomNav
          onOpenCreate={handleOpenCreate}
          unreadCount={unreadCount}
        />
      )}

      {/* Global Create / Edit Rant Bottom Sheet */}
      {showChrome && (
        <CreateRantSheet
          isOpen={isCreateOpen}
          onClose={() => {
            setIsCreateOpen(false);
            setEditRant(null);
          }}
          editRant={editRant}
          onSuccess={() => {
            refreshUnreadCount();
          }}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

