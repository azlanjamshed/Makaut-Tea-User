import React, { useState, useEffect, useRef } from 'react';
import BottomSheet from '../common/BottomSheet';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import { Image as ImageIcon, X, Sparkles, Shield, Send } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/constants';
import { resolveImageUrl } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as postsApi from '../../api/posts';

const CreateRantSheet = ({
  isOpen,
  onClose,
  onSuccess,
  editRant = null,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [text, setText] = useState('');
  const [department, setDepartment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync edit post data when editing
  useEffect(() => {
    if (editRant) {
      setText(editRant.text || '');
      setDepartment(editRant.department || user?.department || '');
      setIsAnonymous(Boolean(editRant.isAnonymous));
      if (editRant.image) {
        setImagePreview(resolveImageUrl(editRant.image));
      } else {
        setImagePreview('');
      }
      setImageFile(null);
    } else {
      setText('');
      setDepartment(user?.department || 'Information Technology (IT)');
      setIsAnonymous(false);
      setImageFile(null);
      setImagePreview('');
    }
  }, [editRant, user, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size cannot exceed 5MB', 'error');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      showToast('Please write something before posting', 'warning');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please sign in to post a rant', 'error');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('text', text.trim());
    formData.append('isAnonymous', String(isAnonymous));
    if (department && department !== 'All') {
      formData.append('department', department);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let result;
      if (editRant) {
        result = await postsApi.updatePost(editRant.id || editRant._id, formData);
        showToast('Rant updated successfully! ✨', 'success');
      } else {
        result = await postsApi.createPost(formData);
        showToast('Your rant has been posted! 🔥', 'success');
      }

      onSuccess?.(result.data);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit rant', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={editRant ? 'Edit Rant' : 'Spill The Tea ☕'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Rant Text */}
        <Textarea
          placeholder="What's going down on campus? Lecture drama? Canteen disaster? Let it out..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          rows={5}
          className="text-base"
        />

        {/* Image Attachment Preview */}
        {imagePreview && (
          <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-50 flex items-center justify-center max-h-56 p-1">
            <img
              src={imagePreview}
              alt="Upload preview"
              className="max-h-52 w-auto h-auto max-w-full object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Row: Department + Add Photo */}
        <div className="space-y-3 pt-1">
          <Select
            label="Department / Field"
            options={DEPARTMENTS.filter((d) => d !== 'All')}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <div className="flex items-center justify-between gap-3 pt-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[var(--border-color)] text-slate-700 hover:text-slate-900 hover:border-slate-400 text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              <ImageIcon className="w-4 h-4 text-[var(--color-primary)]" />
              <span>{imagePreview ? 'Change Photo' : '📷 Add Photo'}</span>
            </button>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>🎭 Anonymous</span>
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] border border-[var(--border-color)]" />
              </div>
            </label>
          </div>

          {isAnonymous && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs text-purple-900">
              <Shield className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>Your name, email, and avatar will be hidden from everyone.</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            isLoading={isSubmitting}
            size="lg"
            className="w-full text-base font-bold"
            icon={Send}
          >
            {editRant ? 'Save Changes' : 'Post Rant 🔥'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default CreateRantSheet;
