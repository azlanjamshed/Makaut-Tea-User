import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Share2,
  Flag,
  Edit3,
  Trash2,
  Check,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Card from "../common/Card";
import ImageLightbox from "../common/ImageLightbox";
import ReactionBar from "./ReactionBar";
import { timeAgo, resolveImageUrl } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const RantCard = ({
  rant,
  onReact,
  onEdit,
  onDelete,
  onReport,
  isDetail = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!rant) return null;

  const currentUserId = user?._id || user?.id;
  const rawAuthorId =
    (typeof rant.user === "object"
      ? rant.user?._id || rant.user?.id
      : rant.user) || rant.userId;

  const isOwner = Boolean(
    user &&
      (rant.isOwner === true ||
        (currentUserId &&
          rawAuthorId &&
          String(currentUserId) === String(rawAuthorId))),
  );

  const isOfficial = Boolean(
    rant.isOfficial || rant.isAdminPost || rant.user?.role === "admin",
  );

  const authorName = isOfficial
    ? rant.user?.name || "Head of MAKAU-TEA Affairs"
    : rant.isAnonymous
      ? rant.user?.anonymousUsername || rant.user?.name || "Anonymous"
      : rant.user?.name || "Student";

  const authorImage = isOfficial
    ? rant.user?.image || "/logo.png"
    : rant.isAnonymous
      ? ""
      : rant.user?.image;

  const authorId =
    !rant.isAnonymous && rant.user ? rant.user._id || rant.user.id : null;

  const handleAuthorClick = (e) => {
    if (authorId) {
      e.stopPropagation();
      navigate(`/profile/${authorId}`);
    }
  };

  const handleCardClick = () => {
    if (!isDetail) {
      navigate(`/rants/${rant.id || rant._id}`);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    const postUrl = `${window.location.origin}/rants/${rant.id || rant._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Campus Rant",
          text: rant.text.substring(0, 100),
          url: postUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    showToast("Post link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const imageSrc = rant.image ? resolveImageUrl(rant.image) : null;

  return (
    <Card
      onClick={handleCardClick}
      hoverable={!isDetail}
      className={`relative overflow-visible group ${
        isOfficial
          ? "border-purple-300 bg-purple-50/25 ring-1 ring-purple-200"
          : ""
      } ${className}`}
    >
      {/* Official Announcement Header Pill */}
      {isOfficial && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-3.5 -mx-1 -mt-1 rounded-xl bg-purple-100/70 border border-purple-200 text-purple-900">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span className="text-[11px] font-bold tracking-wider uppercase font-mono">
              Official Campus Announcement
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 border border-purple-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[var(--color-primary)]" />
            Verified
          </span>
        </div>
      )}

      {/* Top Header: Avatar + Meta + More Menu */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          onClick={authorId ? handleAuthorClick : undefined}
          className={`flex items-center gap-3 overflow-hidden ${
            authorId ? "cursor-pointer group" : ""
          }`}
          title={authorId ? `View ${authorName}'s profile` : undefined}
        >
          <div
            className={
              isOfficial
                ? "p-0.5 rounded-full ring-2 ring-purple-400 shrink-0"
                : "shrink-0"
            }
          >
            <Avatar
              src={authorImage}
              name={authorName}
              isAnonymous={Boolean(rant.isAnonymous && !isOfficial)}
              size="md"
              className={
                authorId
                  ? "group-hover:ring-2 group-hover:ring-purple-300 transition-all"
                  : ""
              }
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-sm font-display truncate ${
                  isOfficial ? "text-[var(--color-primary)]" : "text-slate-900"
                } ${authorId ? "group-hover:text-[var(--color-primary)] transition-colors" : ""}`}
              >
                {authorName}
              </span>
              {isOfficial ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  <ShieldCheck className="w-3 h-3 text-[var(--color-primary)]" />
                  Admin
                </span>
              ) : rant.isAnonymous ? (
                <Badge variant="anon" size="xs">
                  Anonymous
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              {(rant.semester || rant.department) && (
                <>
                  <span
                    className={`font-medium truncate max-w-[150px] sm:max-w-xs ${isOfficial ? "text-purple-700" : "text-slate-600"}`}
                  >
                    {rant.semester || rant.department}
                  </span>
                  <span>·</span>
                </>
              )}
              <span>{timeAgo(rant.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="More post options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-8 z-30 w-44 bg-white border border-[var(--border-color)] rounded-2xl py-1.5 text-xs shadow-lg animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  <span>{copied ? "Copied Link!" : "Share / Copy Link"}</span>
                </button>

                {isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit?.(rant);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:text-[var(--color-primary)] hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Edit Rant</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete?.(rant);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Rant</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onReport?.(rant);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report Rant</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rant Text Body */}
      <div className="text-slate-800 text-sm sm:text-base leading-relaxed break-words whitespace-pre-line font-normal mb-3">
        {rant.text}
      </div>

      {/* Optional Attached Image */}
      {imageSrc && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsLightboxOpen(true);
            }}
            className="interactive-click mb-3.5 group/postimg relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-50 flex items-center justify-center cursor-zoom-in transition-all duration-200 hover:border-purple-300 max-h-[380px] sm:max-h-[460px]"
          >
            {/* Contained image - fits full image without cropping */}
            <img
              src={imageSrc}
              alt="Rant visual"
              className="max-h-[380px] sm:max-h-[460px] w-auto h-auto max-w-full object-contain rounded-xl transition-transform duration-300 group-hover/postimg:scale-[1.01]"
              loading="lazy"
            />
          </div>

          <ImageLightbox
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            imageSrc={imageSrc}
            alt={`Photo by ${authorName}`}
            caption={
              isOfficial
                ? "Official Announcement Attachment"
                : `Post by ${authorName}`
            }
          />
        </>
      )}

      {/* Reactions, Comments, Views Footer */}
      <ReactionBar
        reactions={rant.reactions}
        onReact={(emoji) => onReact?.(rant, emoji)}
        commentsCount={rant.commentsCount || 0}
        views={rant.views || 0}
        onCommentClick={() => {
          if (!isDetail) {
            navigate(`/rants/${rant.id || rant._id}`);
          }
        }}
      />
    </Card>
  );
};

export default RantCard;
