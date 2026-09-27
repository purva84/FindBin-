import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem, WasteCategory } from '../../types';
import {
  History as HistoryIcon,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Building2,
  Truck,
  Star,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Award,
  Recycle,
  ShieldCheck,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const {
    user,
    requests,
    feedbacks,
    setSelectedRequestForJourney,
    setSelectedRequestForFeedback,
    setUserNavTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Cancelled'>('All');

  const userRequests = requests.filter((r) => r.user_id === user.id);
  const pastRequests = userRequests.filter(
    (r) => r.status === 'Completed' || r.status === 'Cancelled' || r.status === 'Rejected'
  );

  const completedRequests = pastRequests.filter((r) => r.status === 'Completed');
  const unratedCompleted = completedRequests.filter(
    (r) => !feedbacks.some((f) => f.request_id === r.id)
  );

  // Filtered requests
  const filteredRequests = pastRequests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.waste_category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || r.waste_category === selectedCategory;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Completed' && r.status === 'Completed') ||
      (statusFilter === 'Cancelled' && (r.status === 'Cancelled' || r.status === 'Rejected'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <HistoryIcon className="w-4 h-4 text-emerald-700" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Collection History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review past material pickups, ratings, and cumulative recycling milestones.
          </p>
        </div>

        <button
          onClick={() => setUserNavTab('my_requests')}
          className="bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Manage Active Requests</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Impact Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Completed Pickups
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {completedRequests.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Diverted</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Pending Reviews
          </div>
          <div className="text-2xl font-black text-amber-600">
            {unratedCompleted.length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>Awaiting your rating</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Reviews Given
          </div>
          <div className="text-2xl font-black text-stone-900">
            {feedbacks.filter((f) => f.user_id === user.id).length}
          </div>
          <div className="text-[11px] text-stone-500 font-semibold">
            Certified feedback
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Eco Rewards
          </div>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-1">
            <span>{completedRequests.length * 100 + feedbacks.filter((f) => f.user_id === user.id).length * 50}</span>
            <span className="text-xs text-emerald-700 font-bold">pts</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Green Citizen</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, organization, or waste..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                statusFilter === 'All'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Past
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                statusFilter === 'Completed'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Completed ({completedRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('Cancelled')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                statusFilter === 'Cancelled'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
              <HistoryIcon className="w-7 h-7 text-stone-400" />
            </div>
            <h3 className="text-base font-extrabold text-stone-800">
              No history found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'All'
                ? 'No past requests match your search filter.'
                : 'Completed pickups will be archived here once collected.'}
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const feedback = feedbacks.find((f) => f.request_id === req.id);
            const isCompleted = req.status === 'Completed';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                      #{req.id}
                    </span>
                    <span className="text-xs font-bold text-stone-600">
                      {req.waste_category}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500 font-medium">
                      {req.quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Successfully Collected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>{req.status}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                      Organization
                    </div>
                    <div className="font-bold text-stone-900 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{req.organization_name}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                      Collection Date
                    </div>
                    <div className="font-semibold text-stone-700 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{req.pickup_date || 'Standard pickup'}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                      Handling Mode
                    </div>
                    <div className="font-semibold text-stone-700 flex items-center gap-1.5 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{req.pickup_method}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Review Section on Completed Items */}
                {isCompleted && (
                  <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {feedback ? (
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-0.5 text-amber-500 pt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= feedback.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                            <span>Your Rating ({feedback.rating}/5)</span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-md">
                              Reviewed ✓
                            </span>
                          </div>
                          {feedback.comment && (
                            <p className="text-[11px] text-stone-600 italic mt-0.5">
                              "{feedback.comment}"
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            How was your collection experience?
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Leave a rating to help verify eco-friendly partners.
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {!feedback && (
                        <button
                          onClick={() => setSelectedRequestForFeedback(req)}
                          className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Rate Collection</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedRequestForJourney(req)}
                        className="bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
