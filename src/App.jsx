import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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

const AppContent = () => {
  const { isAuthenticated } = useAuth();
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
    refreshUnreadCount();
    // Poll every 45s for fresh notifications
    const interval = setInterval(refreshUnreadCount, 45000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

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

  return (
    <div
      className={`min-h-screen ${
        isAuthPage ? "flex justify-center" : "md:h-screen md:overflow-hidden flex"
      } bg-[var(--bg-page)] text-[var(--text-main)] w-full`}
    >
      {/* Scroll restore */}
      <ScrollToTop scrollContainerRef={mainContentRef} />

      {/* Main 3-Column Responsive Shell (Desktop Sidebar | Main Feed | Optional Trending Widget) */}
      <div className="w-full h-full flex justify-between">
        {!isAuthPage && (
          <DesktopSidebar
            onOpenCreate={handleOpenCreate}
            unreadCount={unreadCount}
          />
        )}

        {/* Center Application Viewport */}
        <div
          id="main-viewport"
          ref={mainContentRef}
          className="flex-1 min-w-0 w-full min-h-screen md:h-screen md:overflow-y-auto md:overscroll-contain bg-[var(--bg-page)]"
        >
          <div className="w-full max-w-2xl mx-auto min-h-full border-x-0 md:border-x border-[var(--border-color)]">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenCreate={handleOpenCreate}
                    onOpenEdit={handleOpenEdit}
                    unreadCount={unreadCount}
                  />
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/rants/:id"
                element={<RantDetailsPage onOpenEdit={handleOpenEdit} />}
              />
              <Route
                path="/trending"
                element={<TrendingPage onOpenEdit={handleOpenEdit} />}
              />
              <Route
                path="/search"
                element={<SearchPage onOpenEdit={handleOpenEdit} />}
              />
              <Route
                path="/my-rants"
                element={
                  <MyRantsPage
                    onOpenCreate={handleOpenCreate}
                    onOpenEdit={handleOpenEdit}
                  />
                }
              />
              <Route path="/my-reactions" element={<MyReactionsPage />} />
              <Route path="/announce" element={<AnnouncePage />} />
              <Route
                path="/notifications"
                element={
                  <NotificationsPage onRefreshUnreadCount={refreshUnreadCount} />
                }
              />
              <Route
                path="/profile"
                element={<ProfilePage onOpenEdit={handleOpenEdit} />}
              />
              <Route
                path="/profile/:id"
                element={<ProfilePage onOpenEdit={handleOpenEdit} />}
              />
              <Route path="/profile/edit" element={<EditProfilePage />} />

              {/* Help, Rules & Support Pages */}
              <Route path="/rules" element={<HouseRulesPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/reporting-guide" element={<ReportingGuidePage />} />
              <Route path="/feedback" element={<ContactFeedbackPage />} />
              <Route path="/contact" element={<ContactFeedbackPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/guidelines" element={<CommunityGuidelinesPage />} />
              <Route path="/help" element={<HelpSupportPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>

        {!isAuthPage && <DesktopTrendingWidget />}
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      {!isAuthPage && (
        <MobileBottomNav
          onOpenCreate={handleOpenCreate}
          unreadCount={unreadCount}
        />
      )}

      {/* Global Create / Edit Rant Bottom Sheet */}
      <CreateRantSheet
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditRant(null);
        }}
        editRant={editRant}
        onSuccess={() => {
          // Trigger reload if needed or notification refresh
          refreshUnreadCount();
        }}
      />
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
