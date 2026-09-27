import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquare, User, Calendar, CheckCircle2 } from 'lucide-react';

export const OrgFeedback: React.FC = () => {
  const { activeOrg, feedbacks } = useApp();

  const orgFeedbacks = feedbacks.filter((f) => f.organization_id === activeOrg.id);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* Header with Rating Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
            Verified Customer Reviews
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Customer Feedback
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Reviews and ratings submitted by citizens after pickup completion for {activeOrg.name}.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 p-5 rounded-3xl text-center shrink-0 min-w-44">
          <div className="text-3xl font-extrabold text-stone-900 flex items-center justify-center gap-1">
            <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
            <span>{activeOrg.rating}</span>
          </div>
          <div className="text-xs font-bold text-amber-900 mt-1">Overall Rating</div>
          <div className="text-[11px] text-stone-500">{activeOrg.review_count} verified reviews</div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-stone-900">Recent Customer Reviews</h2>

        {orgFeedbacks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 text-stone-400 text-xs">
            No reviews logged yet for this organization.
          </div>
        ) : (
          orgFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-xs">
                    {fb.user_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm">{fb.user_name}</h3>
                    <div className="text-[11px] text-stone-400">Request #{fb.request_id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl text-xs font-bold border border-amber-200/60">
                  <div className="flex text-amber-500">
                    {'★'.repeat(fb.rating)}
                    {'☆'.repeat(5 - fb.rating)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed italic bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                "{fb.comment}"
              </p>

              {(fb.pickup_rating || fb.communication_rating) && (
                <div className="flex items-center gap-4 text-[11px] text-stone-500 pt-1">
                  {fb.pickup_rating && (
                    <span>Pickup Experience: <strong>{fb.pickup_rating}/5</strong></span>
                  )}
                  {fb.communication_rating && (
                    <span>Communication: <strong>{fb.communication_rating}/5</strong></span>
                  )}
                  <span className="text-stone-400 ml-auto font-mono text-[10px]">
                    {fb.createdAt.split('T')[0]}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
