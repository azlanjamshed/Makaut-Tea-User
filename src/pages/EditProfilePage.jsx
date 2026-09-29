import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/navigation/MobileHeader';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { DEPARTMENTS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as usersApi from '../api/users';
import * as authApi from '../api/auth';
import { Camera, Trash2, Save, KeyRound } from 'lucide-react';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUserState, logout } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image cannot exceed 5MB', 'error');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setIsSavingProfile(true);
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('bio', bio.trim());
    if (department) formData.append('department', department);
    if (semester) formData.append('semester', semester);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await usersApi.updateMyProfile(formData);
      if (res.success && res.data) {
        updateUserState(res.data);
        showToast('Profile updated successfully!', 'success');
        navigate('/profile');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please enter both current and new password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsSavingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    setIsDeletingAccount(true);
    try {
      await usersApi.deleteMyAccount();
      showToast('Your account and rants have been deleted', 'info');
      logout();
      navigate('/register');
    } catch (err) {
      showToast(err.message || 'Failed to delete account', 'error');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full">
      <MobileHeader title="Edit Profile" showBack backUrl="/profile" />

      <main className="px-4 py-4 space-y-6">
        {/* Profile Info Form */}
        <section className="bg-white border border-[var(--border-color)] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 font-display">
            Personal Details
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex items-center gap-4 py-2">
              <Avatar
                src={imagePreview}
                name={name || user?.name}
                size="lg"
                className="ring-2 ring-[var(--color-primary)]/40"
              />
              <div className="space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={Camera}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </Button>
                <p className="text-[11px] text-slate-500">Max 5MB JPG, PNG, WebP</p>
              </div>
            </div>

            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Select
              label="Department"
              options={DEPARTMENTS.filter((d) => d !== 'All')}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <Input
              label="Semester / Year"
              placeholder="e.g. 4th Sem / Year 2"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />

            <Textarea
              label="Bio"
              placeholder="What should the campus know about you?"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={3}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSavingProfile}
                size="md"
                className="w-full font-bold"
                icon={Save}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </section>

        {/* Change Password Form */}
        <section className="bg-white border border-[var(--border-color)] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[var(--color-primary)]" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            <Input
              label="Current Password"
              isPassword
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              isPassword
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />

            <Input
              label="Confirm New Password"
              isPassword
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="secondary"
                isLoading={isSavingPassword}
                size="md"
                className="w-full font-bold"
              >
                Update Password
              </Button>
            </div>
          </form>
        </section>

        {/* Danger Zone: Delete Account */}
        <section className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-5 sm:p-6 space-y-3">
          <h2 className="text-base font-bold text-rose-300 font-display">
            Danger Zone
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deleting your account will permanently delete all your posted rants, comments, and profile data. This action is irreversible.
          </p>
          <Button
            type="button"
            variant="danger"
            size="md"
            icon={Trash2}
            onClick={() => setShowDeleteModal(true)}
            className="w-full font-bold"
          >
            Delete My Account
          </Button>
        </section>
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccountConfirm}
        title="Delete Your Account Permanently?"
        message="All your rants, comments, and reactions will be permanently erased from campus records. This cannot be undone."
        confirmText="Yes, Delete My Account"
        isLoading={isDeletingAccount}
      />
    </div>
  );
};

export default EditProfilePage;
