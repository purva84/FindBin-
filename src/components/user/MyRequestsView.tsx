import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem } from '../../types';
import {
  PackageCheck,
  Calendar,
  Clock,
  Building2,
  Truck,
  ArrowRight,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const MyRequestsView: React.FC = () => {
  const {
    user,
    requests,
    setSelectedRequestForJourney,
    setSelectedRequestForFeedback,
    setSelectedRequestForComplaint,
    setUserNavTab,
    feedbacks,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Cancelled'>('Active');

  const userRequests = requests.filter((r) => r.user_id === user.id);

  const activeRequests = userRequests.filter(
    (r) => r.status !== 'Completed' && r.status !== 'Cancelled' && r.status !== 'Rejected'
  );

  const completedRequests = userRequests.filter((r) => r.status === 'Completed');

  const cancelledRequests = userRequests.filter(
    (r) => r.status === 'Cancelled' || r.status === 'Rejected'
  );

  const unratedCompletedRequests = completedRequests.filter(
    (r) => !feedbacks.some((f) => f.request_id === r.id)
  );

  const displayedRequests =
    activeTab === 'Active'
      ? activeRequests
      : activeTab === 'Completed'
      ? completedRequests
      : cancelledRequests;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Material Requests
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Track pickup timelines, collector assignments, and review completed recycling handovers.
          </p>
        </div>

        <button
          onClick={() => setUserNavTab('create_request')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Request</span>
        </button>
      </div>

      {/* Unrated Completed Requests Prompt Banner */}
      {unratedCompletedRequests.length > 0 && (
        <div className="bg-linear-to-r from-amber-500 to-amber-600 text-white p-4 sm:p-5 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold">
                {unratedCompletedRequests.length === 1
                  ? 'Collection Completed! Rate your handler'
                  : `${unratedCompletedRequests.length} Collections Completed!`}
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Share how punctual and professional the pickup staff was to support certified recovery.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedRequestForFeedback(unratedCompletedRequests[0]);
            }}
            className="bg-stone-950 hover:bg-stone-900 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rate Experience Now</span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('Active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'Active'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Active Requests</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'Active' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {activeRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Completed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'Completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Completed</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'Completed' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {completedRequests.length}
          </span>
          {unratedCompletedRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('Cancelled')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'Cancelled'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Cancelled / Rejected</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'Cancelled' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {cancelledRequests.length}
          </span>
        </button>
      </div>

      {/* Requests List */}
      {displayedRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
          <PackageCheck className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-sm">No {activeTab.toLowerCase()} requests</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {activeTab === 'Active'
              ? 'You do not have any active pickups in progress right now.'
              : activeTab === 'Completed'
              ? 'No requests have completed yet. Once a collector finishes a pickup, you will be invited to leave a rating.'
              : 'No cancelled or rejected requests.'}
          </p>
          {activeTab === 'Active' && (
            <button
              onClick={() => setUserNavTab('create_request')}
              className="mt-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl inline-block cursor-pointer"
            >
              Submit a Request
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedRequests.map((req) => {
            const existingFeedback = feedbacks.find((f) => f.request_id === req.id);
            const isCompleted = req.status === 'Completed';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isCompleted && !existingFeedback
                    ? 'border-amber-300 shadow-xs'
                    : 'border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900 text-sm bg-stone-100 px-2 py-0.5 rounded">
                      #{req.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        req.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : req.status === 'Collector Assigned' || req.status === 'Scheduled'
                          ? 'bg-sky-100 text-sky-800'
                          : req.status === 'Pickup In Progress'
                          ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                      {req.description}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                      <span className="font-semibold text-emerald-800">{req.waste_category}</span>
                      <span>•</span>
                      <span>{req.quantity}</span>
                      <span>•</span>
                      <span>{req.intent === 'sell' ? '💰 Sell' : '♻️ Give'}</span>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold">{req.organization_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{req.pickup_date} · {req.pickup_time}</span>
                    </div>
                    {req.collector_name && (
                      <div className="flex items-center gap-2 text-sky-800 font-medium text-[11px] pt-0.5">
                        <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>Staff: <strong>{req.collector_name}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Feedback Highlight for Completed Requests */}
                  {isCompleted && !existingFeedback && (
                    <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-2xl flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Collection Finished!</span>
                        </div>
                        <p className="text-[11px] text-amber-800/80">Please rate your collection experience</p>
                      </div>
                      <button
                        onClick={() => setSelectedRequestForFeedback(req)}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Star className="w-3 h-3 fill-white" />
                        <span>Rate Now</span>
                      </button>
                    </div>
                  )}

                  {/* Existing Review display */}
                  {isCompleted && existingFeedback && (
                    <div className="bg-emerald-50/70 border border-emerald-200/70 p-3 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Your Rating: {existingFeedback.rating}/5</span>
                        </span>
                        <div className="flex text-amber-400">
                          {'★'.repeat(existingFeedback.rating)}
                          {'☆'.repeat(5 - existingFeedback.rating)}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-600 italic">"{existingFeedback.comment}"</p>
                    </div>
                  )}

                  {req.rejection_reason && (
                    <div className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                      <strong>Reason: </strong> {req.rejection_reason}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCompleted && !existingFeedback ? (
                      <button
                        onClick={() => setSelectedRequestForFeedback(req)}
                        className="bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Rate Collection</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedRequestForComplaint(req)}
                        className="text-stone-400 hover:text-rose-600 text-xs font-medium cursor-pointer"
                      >
                        Report Issue
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedRequestForJourney(req)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Track Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
