import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { REPORT_REASONS } from '../../utils/constants';
import * as reportsApi from '../../api/reports';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Flag, CheckCircle2 } from 'lucide-react';

const ReportSheet = ({
  isOpen,
  onClose,
  targetType = 'post',
  targetId,
}) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].id);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to submit a report', 'error');
      return;
    }

    if (!targetId) {
      showToast('Invalid target item', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportsApi.createReport({
        targetType,
        targetId,
        reason: selectedReason,
        description: description.trim(),
      });

      showToast('Report submitted. Our moderation team will review it.', 'success');
      setDescription('');
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit report', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Report Content">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <p className="text-xs text-slate-600">
          Help us keep the campus community safe and respectful. Select a reason why this {targetType} violates college standards:
        </p>

        {/* Reason Selection Radio Cards */}
        <div className="space-y-2">
          {REPORT_REASONS.map((r) => {
            const isSelected = selectedReason === r.id;
            return (
              <label
                key={r.id}
                onClick={() => setSelectedReason(r.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all shadow-sm ${
                  isSelected
                    ? 'bg-purple-50 border-[var(--color-primary)] text-slate-900'
                    : 'bg-white border-[var(--border-color)] text-slate-700 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold block">{r.label}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{r.desc}</span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Optional Description */}
        <Textarea
          label="Additional Details (Optional)"
          placeholder="Add context to help our moderators..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={3}
        />

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="danger"
            size="lg"
            className="w-full text-sm font-bold"
            icon={Flag}
          >
            Submit Report
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default ReportSheet;
