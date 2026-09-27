import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem, ComplaintCategory } from '../../types';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ComplaintModalProps {
  request: RequestItem | null;
  onClose: () => void;
}

const CATEGORIES: ComplaintCategory[] = [
  'Collector did not arrive',
  'Pickup delayed',
  'Wrong information',
  'Poor communication',
  'Other',
];

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ request, onClose }) => {
  const { user, submitComplaint } = useApp();

  const [category, setCategory] = useState<ComplaintCategory>('Pickup delayed');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitComplaint({
      request_id: request.id,
      user_id: user.id,
      user_name: user.name,
      organization_id: request.organization_id,
      organization_name: request.organization_name,
      category,
      description: description.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="p-5 bg-rose-50/70 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm">Submit a Complaint</h3>
              <p className="text-[11px] text-stone-500">Request #{request.id} · {request.organization_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-base">Complaint Registered</h4>
            <p className="text-xs text-stone-500">
              The organization dispatcher will review your grievance and update the resolution status.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Complaint Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Issue Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Explain what went wrong so the organization can investigate..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>

            <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
              Resolution lifecycle: <strong className="text-stone-700">Open → Investigating → Resolved</strong>. Track updates on your request journey screen.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-stone-600 hover:text-stone-900 text-xs font-bold px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
