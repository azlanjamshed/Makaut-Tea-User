import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Camera, X, ArrowRight } from 'lucide-react';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { DEPARTMENTS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import appLogo from '../assets/logo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim().toLowerCase());
    formData.append('password', password);
    if (bio.trim()) formData.append('bio', bio.trim());
    if (department && department !== 'All') formData.append('department', department);
    if (imageFile) formData.append('image', imageFile);

    try {
      await register(formData);
      showToast('Account created! Welcome to CampusRant 🎉', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Link to="/" className="inline-block group mb-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-[var(--border-color)] group-hover:scale-105 transition-transform bg-white shadow-md">
            <img src={appLogo} alt="Rantea" className="w-full h-full object-cover" />
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">
          Join Ran<span className="text-[var(--color-primary)]">tea</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Your own ranting platform — vent, react, and connect with fellow students.
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full bg-white border border-[var(--border-color)] rounded-3xl p-6 sm:p-7 shadow-sm">
        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center gap-2 pb-2">
            <div className="relative group">
              {imagePreview ? (
                <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-[var(--color-primary)]">
                  <img
                    src={imagePreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-3xl bg-slate-50 border-2 border-dashed border-[var(--border-color)] hover:border-[var(--color-primary)] flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 transition-all group-active:scale-95"
                >
                  <Camera className="w-6 h-6 mb-1 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />
                  <span className="text-[10px] font-semibold">Avatar</span>
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="text-[11px] text-slate-500">
              Optional profile picture (Max 5MB)
            </span>
          </div>

          <Input
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <Input
            label="College Email"
            type="email"
            placeholder="student@college.edu"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Select
            label="Department / Course"
            options={DEPARTMENTS.filter((d) => d !== 'All')}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Select Department..."
          />

          <Input
            label="Password"
            isPassword
            placeholder="At least 6 characters"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            isPassword
            placeholder="Re-enter password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Textarea
            label="Bio (Optional)"
            placeholder="Tell campus a bit about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            rows={2}
          />

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full text-base font-bold"
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[var(--color-primary)] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Sign in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
