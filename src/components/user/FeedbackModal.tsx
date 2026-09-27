import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem } from '../../types';
import { Star, X, CheckCircle2, Truck, Building2, ThumbsUp, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  request: RequestItem | null;
  onClose: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor Experience',
  2: 'Fair / Needs Improvement',
  3: 'Good Service',
  4: 'Very Good & Professional',
  5: 'Outstanding Service! ⭐',
};

const QUICK_TAGS = [
  '⚡ Punctual & On Time',
  '🤝 Courteous Collector',
  '⚖️ Accurate Digital Weighing',
  '🌱 Safe Eco-Handling',
  '💵 Fast Scrap Payout',
  '📦 Seamless Pickup',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ request, onClose }) => {
  const { user, submitFeedback } = useApp();

  const [rating, setRating] = useState(5);
  const [pickupRating, setPickupRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['⚡ Punctual & On Time', '🌱 Safe Eco-Handling']);
  const [comment, setComment] = useState('Punctual and courteous pickup. Material was weighed and handled responsibly.');
  const [submitted, setSubmitted] = useState(false);

  if (!request) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const exists = prev.includes(tag);
      const next = exists ? prev.filter((t) => t !== tag) : [...prev, tag];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagText = selectedTags.length > 0 ? ` [Highlights: ${selectedTags.join(', ')}]` : '';
    submitFeedback({
      request_id: request.id,
      user_id: user.id,
      user_name: user.name,
      organization_id: request.organization_id,
      rating,
      pickup_rating: pickupRating,
      communication_rating: commRating,
      comment: `${comment.trim()}${tagText}`,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1300);
  };

  const StarPicker = ({
    val,
    onChange,
    label,
  }: {
    val: number;
    onChange: (n: number) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-stone-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-stone-300 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
          >
            <Star
              className={`w-5 h-5 ${
                star <= val ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>Collection Completed</span>
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">#{request.id}</span>
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">Rate Your Collection Experience</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-lg">Thank you for your rating!</h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Your review has been recorded and submitted to {request.organization_name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
            {/* Request Context Card */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-stone-900">{request.description}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  {request.waste_category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-stone-500 text-[11px] pt-1">
                <span>🏢 Handler: <strong>{request.organization_name}</strong></span>
                {request.collector_name && (
                  <span>• 🚚 Staff: <strong>{request.collector_name}</strong></span>
                )}
              </div>
            </div>

            {/* Primary Star Rating */}
            <div className="text-center py-2 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-2">
              <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Overall Satisfaction
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'fill-amber-400 text-amber-400 drop-shadow-xs' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-amber-800">
                {RATING_LABELS[rating] || ''}
              </div>
            </div>

            {/* Sub-ratings */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <StarPicker val={pickupRating} onChange={setPickupRating} label="Pickup Punctuality & Equipment" />
              <StarPicker val={commRating} onChange={setCommRating} label="Staff Communication & Courtesy" />
            </div>

            {/* Quick Tag Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                What went well?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Detailed Feedback & Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience with the pickup staff, weighing accuracy, and material handling..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-stone-600 hover:text-stone-900 text-xs font-bold px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Rating & Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
