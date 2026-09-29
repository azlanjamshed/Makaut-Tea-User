import React, { useState } from "react";
import Modal from "../common/Modal";
import Select from "../common/Select";
import Button from "../common/Button";
import Avatar from "../common/Avatar";
import { DEPARTMENTS } from "../../utils/constants";
import { GraduationCap, BookOpen, Sparkles, ArrowRight } from "lucide-react";

const SEMESTERS = [
  "1st Semester (1st Year)",
  "2nd Semester (1st Year)",
  "3rd Semester (2nd Year)",
  "4th Semester (2nd Year)",
  "5th Semester (3rd Year)",
  "6th Semester (3rd Year)",
  "7th Semester (4th Year)",
  "8th Semester (4th Year)",
  "Postgraduate / MTech",
  "Alumni",
  "Faculty / Staff",
];

const OnboardingModal = ({ isOpen, user, onComplete }) => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out "All" from departments for selection
  const deptOptions = DEPARTMENTS.filter((d) => d !== "All").map((d) => ({
    value: d,
    label: d,
  }));

  const semesterOptions = SEMESTERS.map((s) => ({
    value: s,
    label: s,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!department) {
      setError("Please select your department");
      return;
    }

    if (!semester) {
      setError("Please select your current semester or year");
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete({ department, semester, bio });
    } catch (err) {
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Cannot dismiss without completing onboarding
      title="Complete Your Campus Profile"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* User preview header */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200">
          <Avatar
            src={user?.image}
            name={user?.name || "Student"}
            size="md"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 truncate">
              {user?.name || "Welcome!"}
            </h3>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          To connect you with your batchmates and official campus broadcasts, please select your department and semester.
        </p>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <Select
          label="Department"
          options={deptOptions}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          placeholder="Select your department"
        />

        <Select
          label="Semester / Academic Year"
          options={semesterOptions}
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
          placeholder="Select your semester"
        />

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Bio (Optional)
          </label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. 8 AM lab survivor, caffeinated coder"
            maxLength={120}
            className="w-full bg-slate-50 border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            size="lg"
            className="w-full text-base font-bold flex items-center justify-center gap-2"
          >
            <span>Enter Campus</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OnboardingModal;
