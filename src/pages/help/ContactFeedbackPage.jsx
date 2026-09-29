import React, { useState, useRef } from 'react';
import MobileHeader from '../../components/navigation/MobileHeader';
import Button from '../../components/common/Button';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  MessageCircle,
  Upload,
  X,
  Send,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as feedbackApi from '../../api/feedback';

const ContactFeedbackPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [feedbackType, setFeedbackType] = useState('suggestion'); // 'bug' | 'suggestion' | 'general'
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Attachment cannot exceed 5MB', 'error');
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
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      showToast('Please enter a subject / title', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Please enter your message or description', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', feedbackType);
      formData.append('subject', subject.trim());
      formData.append('description', description.trim());
      if (deviceInfo.trim()) formData.append('deviceInfo', deviceInfo.trim());
      if (contactEmail.trim()) formData.append('contactEmail', contactEmail.trim());
      if (selectedFile) formData.append('image', selectedFile);

      const res = await feedbackApi.submitFeedback(formData);
      if (res.success) {
        setIsSubmittedSuccess(true);
      }
    } catch (err) {
      showToast(err.message || 'Failed to send feedback', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubject('');
    setDescription('');
    setDeviceInfo('');
    handleRemoveFile();
    setIsSubmittedSuccess(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-2xl mx-auto w-full">
      <MobileHeader title="Contact & Feedback" showBack backUrl="/help" />

      <main className="px-4 py-4 space-y-6">
        {/* Hero Section */}
        <div className="rounded-3xl bg-white border border-[var(--border-color)] p-6 space-y-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 flex items-center justify-center text-2xl shrink-0">
              💬
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Talk to us
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Found a bug? Have an idea? Just want to tell us something?
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 pt-1 font-medium">
            We're listening. Your feedback shapes the future of this platform.
          </p>
        </div>

        {/* Success State */}
        {isSubmittedSuccess ? (
          <div className="p-8 rounded-3xl bg-white border border-emerald-200 text-center space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Thanks a million!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your message has been sent directly to the people keeping this thing alive. We review every single note.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleReset}
              className="mt-2"
            >
              Send another note
            </Button>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-3xl bg-white border border-[var(--border-color)] space-y-5 shadow-sm">
            {/* Feedback Type Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                What would you like to tell us?
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackType('bug')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all gap-1.5 ${
                    feedbackType === 'bug'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-[var(--border-color)] text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Bug className="w-5 h-5 text-rose-500" />
                  <span>🐛 Bug</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackType('suggestion')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all gap-1.5 ${
                    feedbackType === 'suggestion'
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'bg-slate-50 border-[var(--border-color)] text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>💡 Suggestion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackType('general')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all gap-1.5 ${
                    feedbackType === 'general'
                      ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'bg-slate-50 border-[var(--border-color)] text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>💬 Feedback</span>
                </button>
              </div>

              {/* Type helper hint */}
              <div className="text-[11px] text-slate-500 pt-1">
                {feedbackType === 'bug' && 'Something isn\'t working properly or crashed.'}
                {feedbackType === 'suggestion' && 'Have an idea or feature that would make Rantea even better? Tell us!'}
                {feedbackType === 'general' && 'General thoughts, shout-outs, questions, or campus inquiries.'}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {feedbackType === 'bug' && 'What broke?'}
                {feedbackType === 'suggestion' && 'Feature Title'}
                {feedbackType === 'general' && 'Subject'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  feedbackType === 'bug'
                    ? 'e.g. Reaction button isn\'t updating on mobile'
                    : feedbackType === 'suggestion'
                    ? 'e.g. Add polls so students can vote on college questions'
                    : 'e.g. Great platform, quick thought on campus events'
                }
                className="w-full bg-slate-50 border border-[var(--border-color)] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Description / Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {feedbackType === 'bug' && 'Describe what happened and how to reproduce it'}
                {feedbackType === 'suggestion' && 'Why would this feature be useful for students?'}
                {feedbackType === 'general' && 'Your Message'} <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={
                  feedbackType === 'bug'
                    ? 'I clicked on the laugh emoji twice and the count stayed at 0...'
                    : feedbackType === 'suggestion'
                    ? 'Polls would let us vote on canteen quality, library hours, and semester dates...'
                    : 'Write whatever is on your mind...'
                }
                className="w-full bg-slate-50 border border-[var(--border-color)] rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            {/* If Bug: Optional Device info */}
            {feedbackType === 'bug' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Device / Browser (Optional)</span>
                </label>
                <input
                  type="text"
                  value={deviceInfo}
                  onChange={(e) => setDeviceInfo(e.target.value)}
                  placeholder="e.g. iPhone 14 Safari, Windows Chrome v120"
                  className="w-full bg-slate-50 border border-[var(--border-color)] rounded-2xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white"
                />
              </div>
            )}

            {/* Optional contact email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Your Email (Optional, if you want a response)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your.email@college.edu"
                className="w-full bg-slate-50 border border-[var(--border-color)] rounded-2xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white"
              />
            </div>

            {/* Optional Screenshot */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Attach Screenshot (Optional)
              </label>

              {filePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-100 max-h-48 flex items-center justify-center">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-48 w-auto h-auto max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--color-primary)] rounded-2xl p-4 text-center cursor-pointer bg-slate-50/60 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs text-slate-600"
                >
                  <Upload className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Click to add screenshot (PNG/JPG up to 5MB)</span>
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

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || !subject.trim() || !description.trim()}
              icon={Send}
              className="w-full font-bold"
            >
              {isSubmitting ? 'Sending to Team...' : 'Send Feedback'}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default ContactFeedbackPage;
