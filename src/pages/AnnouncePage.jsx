import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Megaphone,
  Send,
  Upload,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Info,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import MobileHeader from "../components/navigation/MobileHeader";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { timeAgo, resolveImageUrl } from "../utils/helpers";
import * as announcementsApi from "../api/announcements";

const CATEGORIES = [
  { id: "event", label: "Event / Workshop / Hackathon" },
  { id: "academic", label: "Academic & Exam Notice" },
  { id: "club", label: "Cultural & Club Activity" },
  { id: "urgent", label: "Urgent Campus Advisory" },
  { id: "lost_found", label: "Lost & Found Notice" },
  { id: "general", label: "General Campus Update" },
];

const AnnouncePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("propose"); // 'propose' | 'history'
  const [myRequests, setMyRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("event");
  const [targetAudience, setTargetAudience] = useState("All Students");
  const [contactInfo, setContactInfo] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const fetchMyRequests = async () => {
    if (!isAuthenticated) return;
    setIsLoadingRequests(true);
    try {
      const res = await announcementsApi.getMyAnnouncementRequests();
      if (res.success && res.data) {
        setMyRequests(res.data);
      }
    } catch (err) {
      // silently handle
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyRequests();
    }
  }, [isAuthenticated]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size cannot exceed 5MB", "error");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Please sign in to submit an announcement proposal", "warning");
      navigate("/login");
      return;
    }

    if (!title.trim()) {
      showToast("Please provide an announcement title", "error");
      return;
    }

    if (!text.trim()) {
      showToast("Please provide the announcement details", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("text", text.trim());
      formData.append("category", category);
      formData.append(
        "targetAudience",
        targetAudience.trim() || "All Students",
      );
      formData.append("contactInfo", contactInfo.trim());
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await announcementsApi.createAnnouncementRequest(formData);
      if (res.success) {
        showToast("Announcement request submitted to Admin!", "success");
        setTitle("");
        setText("");
        setCategory("event");
        setTargetAudience("All Students");
        setContactInfo("");
        handleRemoveFile();
        setActiveTab("history");
        fetchMyRequests();
      }
    } catch (err) {
      showToast(err.message || "Failed to submit proposal", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await announcementsApi.deleteAnnouncementRequest(id);
      setMyRequests((prev) => prev.filter((r) => (r.id || r._id) !== id));
      showToast("Proposal cancelled", "success");
    } catch (err) {
      showToast(err.message || "Failed to cancel request", "error");
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="Campus Broadcasts" showBack />

      <main className="px-4 py-4 space-y-5">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-[var(--border-color)] p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2.5 text-[var(--color-primary)]">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                Announce via Administration
              </h2>
              <p className="text-xs text-slate-500">
                Official Campus Verification & Broadcast Pipeline
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Need to broadcast a club event, workshop, competition, or urgent
            student advisory to all students? Submit your announcement proposal
            directly to the <strong>Head of MAKAU-TEA Affairs</strong>. Once
            approved, it gets published officially to the campus stream.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[var(--border-color)] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("propose")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "propose"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit Proposal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "history"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Proposals ({myRequests.length})</span>
          </button>
        </div>

        {/* Tab 1: Submit Proposal Form */}
        {activeTab === "propose" ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[var(--border-color)] rounded-3xl p-5 space-y-4 shadow-sm"
          >
            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">
                  Announcement Title / Headline{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {title.length}/150
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 150))}
                placeholder="e.g. Annual Inter-College Coding Hackathon 2026 Registration Open"
                className="w-full bg-white border border-[var(--border-color)] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-colors"
                required
              />
            </div>

            {/* Category & Target Audience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-[var(--border-color)] rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[var(--color-primary)] shadow-sm cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Target Audience / Semester
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. All Students, Semester 4, CS Dept"
                  className="w-full bg-white border border-[var(--border-color)] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-colors"
                />
              </div>
            </div>

            {/* Detailed Body */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">
                  Detailed Announcement Message{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {text.length}/3000
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 3000))}
                rows={5}
                placeholder="Include event schedule, venue, registration links, eligibility rules, or advisory details..."
                className="w-full bg-white border border-[var(--border-color)] rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            {/* Contact Info / Organizers */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Contact Info / Organizers
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g. Robotics Club • robotics@college.edu • Room 402"
                className="w-full bg-white border border-[var(--border-color)] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-colors"
              />
            </div>

            {/* Optional Flyer / Attachment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Attach Poster / Flyer (Optional)</span>
                <span className="text-[11px] text-slate-400">Max 5MB</span>
              </label>

              {filePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-50 max-h-56 flex items-center justify-center group">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-56 w-auto h-auto max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/80 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--color-primary)] rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-purple-50/20 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 block">
                      Click to upload event flyer or circular
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WEBP up to 5MB
                    </span>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Anti-spam Advisory Note */}
            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-xs text-sky-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                All requests are reviewed by university administrators before
                public broadcast. Approved posts will be published with official
                announcement status.
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || !title.trim() || !text.trim()}
              icon={Send}
              className="w-full font-bold"
            >
              {isSubmitting
                ? "Submitting Proposal..."
                : "Submit Announcement Proposal"}
            </Button>
          </form>
        ) : (
          /* Tab 2: My Proposals List */
          <div className="space-y-4">
            {isLoadingRequests ? (
              <div className="space-y-3 py-6">
                <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
                <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
              </div>
            ) : myRequests.length === 0 ? (
              <EmptyState
                emoji="📭"
                title="No announcement proposals yet"
                message="You haven't submitted any campus announcement requests yet. Switch to 'Submit Proposal' to create one."
                actionLabel="Create Proposal"
                onAction={() => setActiveTab("propose")}
              />
            ) : (
              myRequests.map((req) => {
                const reqId = req.id || req._id;
                const isPending = req.status === "pending";
                const isApproved = req.status === "approved";
                const isRejected = req.status === "rejected";

                return (
                  <div
                    key={reqId}
                    className="p-5 rounded-3xl bg-white border border-[var(--border-color)] space-y-3.5 shadow-sm"
                  >
                    {/* Header: Title + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {req.category?.toUpperCase() || "GENERAL"}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {timeAgo(req.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                          {req.title}
                        </h3>
                      </div>

                      {/* Status Badges */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved & Broadcasted</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </div>

                    {/* Body snippet */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {req.text}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-[var(--border-color)] text-[11px]">
                        Target: {req.targetAudience || "All Students"}
                      </span>
                      {req.contactInfo && (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-[var(--border-color)] text-[11px]">
                          Contact: {req.contactInfo}
                        </span>
                      )}
                    </div>

                    {/* Admin Feedback Box */}
                    {req.adminFeedback && (
                      <div
                        className={`p-3 rounded-2xl text-xs space-y-1 ${
                          isApproved
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                            : "bg-rose-50 border border-rose-200 text-rose-900"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Review Notes:</span>
                        </div>
                        <p>{req.adminFeedback}</p>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                      {isApproved && req.publishedPost ? (
                        <Link
                          to={`/rants/${req.publishedPost}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
                        >
                          <span>View Live Campus Broadcast</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <div />
                      )}

                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRequest(reqId)}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AnnouncePage;
