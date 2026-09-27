import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, RequestItem } from '../../types';
import {
  PlusCircle,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Star,
  Search,
  Filter,
  MapPin,
  Truck,
  Phone,
  MessageSquare,
  AlertCircle,
  Sparkles,
  X,
  FileText,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

type RequestFilterTab = 'active' | 'completed' | 'cancelled_rejected';

const CATEGORY_OPTIONS: ('All' | WasteCategory)[] = [
  'All',
  'E-Waste',
  'Battery / Hazardous',
  'Textile',
  'Plastic',
  'Paper & Cardboard',
  'Metal',
  'Glass',
  'Wet / Organic Waste',
  'Mixed Waste',
  'Other',
];

export const UserDashboard: React.FC = () => {
  const {
    user,
    requests,
    setUserNavTab,
    setSelectedRequestForJourney,
    setSelectedOrgForDetails,
    setSelectedRequestForFeedback,
    setSelectedRequestForComplaint,
    updateRequestStatus,
    feedbacks,
  } = useApp();

  // Active tab state: 'active' | 'completed' | 'cancelled_rejected'
  const [activeTab, setActiveTab] = useState<RequestFilterTab>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | WasteCategory>('All');

  // Cancel Request Confirmation Dialog State
  const [cancelModalReq, setCancelModalReq] = useState<RequestItem | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Filter requests belonging to this user
  const userRequests = useMemo(
    () => requests.filter((r) => r.user_id === user.id),
    [requests, user.id]
  );

  // Unrated completed request banner
  const unratedCompleted = useMemo(
    () =>
      userRequests.filter(
        (r) => r.status === 'Completed' && !feedbacks.some((f) => f.request_id === r.id)
      ),
    [userRequests, feedbacks]
  );

  // Factual count categorizations
  const activeRequests = useMemo(
    () =>
      userRequests.filter(
        (r) =>
          r.status !== 'Completed' &&
          r.status !== 'Cancelled' &&
          r.status !== 'Rejected'
      ),
    [userRequests]
  );

  const completedRequests = useMemo(
    () => userRequests.filter((r) => r.status === 'Completed'),
    [userRequests]
  );

  const cancelledOrRejectedRequests = useMemo(
    () =>
      userRequests.filter(
        (r) => r.status === 'Cancelled' || r.status === 'Rejected'
      ),
    [userRequests]
  );

  // Tab-filtered dataset
  const currentTabRequests = useMemo(() => {
    let list: RequestItem[] = [];
    if (activeTab === 'active') {
      list = activeRequests;
    } else if (activeTab === 'completed') {
      list = completedRequests;
    } else {
      list = cancelledOrRejectedRequests;
    }

    // Apply search and category filter
    return list.filter((r) => {
      const matchesSearch =
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.waste_category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'All' || r.waste_category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [
    activeTab,
    activeRequests,
    completedRequests,
    cancelledOrRejectedRequests,
    searchQuery,
    categoryFilter,
  ]);

  // Handle Cancel Request Submission
  const handleConfirmCancel = () => {
    if (!cancelModalReq) return;
    const note = cancelReason.trim()
      ? `Cancelled by citizen: ${cancelReason.trim()}`
      : 'Cancelled by citizen';
    updateRequestStatus(cancelModalReq.id, 'Cancelled', note);
    setCancelModalReq(null);
    setCancelReason('');
  };

  // Helper function to return human-friendly badge color
  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Pending Review',
        };
      case 'Accepted':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-500',
          label: 'Accepted',
        };
      case 'Scheduled':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
          label: 'Scheduled',
        };
      case 'Collector Assigned':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Collector Assigned',
        };
      case 'Pickup In Progress':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500 animate-pulse',
          label: 'Collector En Route',
        };
      case 'Picked Up':
        return {
          bg: 'bg-violet-50 text-violet-800 border-violet-200',
          dot: 'bg-violet-500',
          label: 'Picked Up',
        };
      case 'Completed':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Completed',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Rejected',
        };
      case 'Cancelled':
      default:
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
          label: 'Cancelled',
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
      {/* Hero Welcome Card - Crisp White Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-white text-stone-900 p-6 sm:p-8 shadow-xs border border-stone-200">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-64 h-64 rounded-full bg-teal-50/70 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
              <span>Welcome back, {user.name}</span>
              <span className="text-2xl inline-block" role="img" aria-label="wave">
                👋
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-xl">
              Create a collection request, track your recyclable materials, or connect with verified organizations.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setUserNavTab('create_request')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Create Request</span>
            </button>

            <button
              onClick={() => setUserNavTab('organizations')}
              className="bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Find Organization</span>
            </button>
          </div>
        </div>

        {/* Decorative background recycle watermark */}
        <div className="absolute right-4 -bottom-6 opacity-[0.04] text-[160px] pointer-events-none select-none text-emerald-950">
          ♻️
        </div>
      </div>

      {/* Prompt Banner if user has any unrated completed requests */}
      {unratedCompleted.length > 0 && (
        <div className="bg-amber-500 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold">
                Collection Completed for #{unratedCompleted[0].id}!
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                How was your pickup with <strong>{unratedCompleted[0].organization_name}</strong>? Share feedback to support transparent circular recycling.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRequestForFeedback(unratedCompleted[0])}
            className="bg-white hover:bg-amber-50 text-amber-900 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Rate Pickup Now</span>
          </button>
        </div>
      )}

      {/* Three Direct Stat Cards (Active, Completed, Cancel / Rejected) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Requests Card */}
        <button
          onClick={() => setActiveTab('active')}
          className={`text-left p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
            activeTab === 'active'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50/50'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Active Requests
            </span>
            <div className="text-3xl font-extrabold text-stone-900">
              {activeRequests.length}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Pending, scheduled & in transit
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <Clock className="w-6 h-6" />
          </div>
        </button>

        {/* Completed Card */}
        <button
          onClick={() => setActiveTab('completed')}
          className={`text-left p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
            activeTab === 'completed'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-stone-200 hover:border-emerald-200 hover:bg-stone-50/50'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="text-3xl font-extrabold text-stone-900">
              {completedRequests.length}
            </div>
            <span className="text-[11px] text-stone-600 font-semibold">
              Successfully collected & processed
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </button>

        {/* Cancel / Rejected Card */}
        <button
          onClick={() => setActiveTab('cancelled_rejected')}
          className={`text-left p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
            activeTab === 'cancelled_rejected'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-stone-200 hover:border-rose-200 hover:bg-stone-50/50'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Cancel / Rejected
            </span>
            <div className="text-3xl font-extrabold text-stone-900">
              {cancelledOrRejectedRequests.length}
            </div>
            <span className="text-[11px] text-rose-700 font-semibold">
              Cancelled or declined requests
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              activeTab === 'cancelled_rejected'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            <XCircle className="w-6 h-6" />
          </div>
        </button>
      </div>

      {/* Unified Requests Management Section (Replaced Recent Requests & Top Certified Handlers) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
        {/* Navigation Tabs & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200/80 max-w-fit overflow-x-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'active'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Requests</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  activeTab === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {activeRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Completed</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  activeTab === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {completedRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled_rejected')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cancelled_rejected'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Cancel / Rejected</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  activeTab === 'cancelled_rejected'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {cancelledOrRejectedRequests.length}
              </span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search request #, item or org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 rounded-xl py-1.5 pl-3 pr-7 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Request List */}
        {currentTabRequests.length === 0 ? (
          <div className="text-center py-14 px-4 space-y-3 bg-stone-50/50 rounded-2xl border border-stone-200/60">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-stone-400 mx-auto flex items-center justify-center">
              {activeTab === 'active' ? (
                <Clock className="w-6 h-6 text-emerald-600" />
              ) : activeTab === 'completed' ? (
                <CheckCircle2 className="w-6 h-6 text-stone-400" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-500" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-stone-900">
                {activeTab === 'active'
                  ? 'No active collection requests'
                  : activeTab === 'completed'
                  ? 'No completed requests yet'
                  : 'No cancelled or rejected requests'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {activeTab === 'active'
                  ? 'Ready to recycle or donate unwanted materials? Click Create Request to get started.'
                  : activeTab === 'completed'
                  ? 'Once an authorized organization completes your collection, receipts and review options will be listed here.'
                  : 'Requests that you cancel or that cannot be accepted due to non-segregation criteria will appear here.'}
              </p>
            </div>

            {activeTab === 'active' && (
              <div className="pt-2">
                <button
                  onClick={() => setUserNavTab('create_request')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Request Now</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentTabRequests.map((req) => {
              const badge = getStatusBadge(req.status);
              const isReviewed = feedbacks.some((f) => f.request_id === req.id);
              const userFeedback = feedbacks.find((f) => f.request_id === req.id);
              const canCancel =
                req.status === 'Pending' ||
                req.status === 'Accepted' ||
                req.status === 'Scheduled';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-300/80 transition-all shadow-xs space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-xs text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                        #{req.id}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {req.waste_category}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {req.intent === 'sell' ? '💰 Sell for scrap' : '♻️ Recycle / Dispose'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Material & Quantity */}
                    <div className="space-y-1.5 md:col-span-1">
                      <div className="text-xs font-bold text-stone-900 leading-snug">
                        {req.description}
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        Quantity: <strong className="text-stone-700">{req.quantity}</strong>
                      </div>
                      {req.special_instructions && (
                        <div className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                          "{req.special_instructions}"
                        </div>
                      )}
                    </div>

                    {/* Logistics & Location */}
                    <div className="space-y-1.5 text-xs text-stone-600 md:col-span-1">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{req.organization_name}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{req.pickup_address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>
                          {req.pickup_date} · {req.pickup_time}
                        </span>
                      </div>
                    </div>

                    {/* Collector & Status notes */}
                    <div className="space-y-2 md:col-span-1">
                      {req.collector_name ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                            <Truck className="w-3 h-3 text-emerald-600" />
                            <span>Assigned Field Collector</span>
                          </div>
                          <div className="font-extrabold text-stone-900">
                            {req.collector_name}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-stone-400" />
                              <span>{req.collector_phone}</span>
                            </span>
                          </div>
                        </div>
                      ) : req.status === 'Completed' ? (
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Recovery Successful</span>
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Collected on schedule. Verified recovery chain complete.
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>Pickup Pipeline</span>
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {req.status === 'Pending'
                              ? 'Awaiting facility dispatch confirmation.'
                              : 'Slot reserved with facility fleet.'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rejection / Cancellation Callout Box */}
                  {(req.status === 'Rejected' || req.status === 'Cancelled') && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                        req.status === 'Rejected'
                          ? 'bg-rose-50 border border-rose-200 text-rose-900'
                          : 'bg-stone-50 border border-stone-200 text-stone-800'
                      }`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          req.status === 'Rejected' ? 'text-rose-600' : 'text-stone-500'
                        }`}
                      />
                      <div className="space-y-0.5">
                        <div className="font-extrabold">
                          {req.status === 'Rejected'
                            ? 'Facility Rejection Note'
                            : 'Cancellation Record'}
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {req.rejection_reason ||
                            (req.timeline &&
                              req.timeline.find((t) => t.status === req.status)?.note) ||
                            'No specific details provided.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                    <div className="text-[11px] text-stone-400 font-medium">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Track Journey Button */}
                      <button
                        onClick={() => setSelectedRequestForJourney(req)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-600" />
                        <span>Track Status</span>
                      </button>

                      {/* Cancel Request (for active pending/scheduled) */}
                      {canCancel && (
                        <button
                          onClick={() => setCancelModalReq(req)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Cancel Request</span>
                        </button>
                      )}

                      {/* Rate Collection (if Completed) */}
                      {req.status === 'Completed' && (
                        <>
                          {isReviewed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>Rated {userFeedback?.rating}★</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedRequestForFeedback(req)}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" />
                              <span>Rate Collection</span>
                            </button>
                          )}
                        </>
                      )}

                      {/* Report Issue / Complaint */}
                      <button
                        onClick={() => setSelectedRequestForComplaint(req)}
                        className="text-stone-500 hover:text-stone-800 text-xs font-bold px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1"
                        title="File a grievance or support inquiry for this request"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Support</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {cancelModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-sm text-stone-900">Cancel Collection Request</h3>
              </div>
              <button
                onClick={() => {
                  setCancelModalReq(null);
                  setCancelReason('');
                }}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to cancel request <strong>#{cancelModalReq.id}</strong> (
              {cancelModalReq.waste_category}) with <strong>{cancelModalReq.organization_name}</strong>?
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Reason for cancellation (optional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Plans changed, dropped off locally, item repaired..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setCancelModalReq(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Keep Request
              </button>
              <button
                onClick={handleConfirmCancel}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
