import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem } from '../../types';
import {
  Inbox,
  Clock,
  Calendar,
  CheckCircle2,
  Truck,
  Users,
  AlertTriangle,
  ArrowRight,
  Search,
  MapPin,
  User,
  Phone,
  Filter,
  X,
  FileText,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const OrgDashboard: React.FC = () => {
  const {
    activeOrg,
    requests,
    collectors,
    setOrgNavTab,
    setSelectedRequestForJourney,
    updateRequestStatus,
    assignCollector,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'assigned' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reassignModalReq, setReassignModalReq] = useState<RequestItem | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Organization requests
  const orgRequests = useMemo(
    () => requests.filter((r) => r.organization_id === activeOrg.id),
    [requests, activeOrg.id]
  );

  const pendingRequests = useMemo(
    () => orgRequests.filter((r) => r.status === 'Pending'),
    [orgRequests]
  );

  const scheduledRequests = useMemo(
    () =>
      orgRequests.filter(
        (r) =>
          r.status === 'Scheduled' ||
          r.status === 'Collector Assigned' ||
          r.status === 'Accepted'
      ),
    [orgRequests]
  );

  const inProgressRequests = useMemo(
    () =>
      orgRequests.filter(
        (r) => r.status === 'Pickup In Progress' || r.status === 'Picked Up'
      ),
    [orgRequests]
  );

  const completedRequests = useMemo(
    () => orgRequests.filter((r) => r.status === 'Completed'),
    [orgRequests]
  );

  // All active and scheduled pickups for today / current operations
  const allOperationalPickups = useMemo(
    () =>
      orgRequests.filter(
        (r) =>
          r.status !== 'Pending' &&
          r.status !== 'Rejected' &&
          r.status !== 'Cancelled'
      ),
    [orgRequests]
  );

  // Filtered pickups list
  const filteredPickups = useMemo(() => {
    return allOperationalPickups.filter((req) => {
      // Tab filter
      if (activeFilter === 'assigned') {
        if (req.status !== 'Collector Assigned' && req.status !== 'Scheduled') return false;
      } else if (activeFilter === 'in_progress') {
        if (req.status !== 'Pickup In Progress' && req.status !== 'Picked Up') return false;
      } else if (activeFilter === 'completed') {
        if (req.status !== 'Completed') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          req.id.toLowerCase().includes(q) ||
          req.user_name.toLowerCase().includes(q) ||
          req.pickup_address.toLowerCase().includes(q) ||
          req.waste_category.toLowerCase().includes(q) ||
          (req.collector_name && req.collector_name.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [allOperationalPickups, activeFilter, searchQuery]);

  const handleReassignStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignModalReq || !selectedStaffId) return;

    assignCollector(reassignModalReq.id, selectedStaffId);
    setReassignModalReq(null);
    setSelectedStaffId('');
  };

  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'Accepted':
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
          label: 'Staff En Route',
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
      default:
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
          label: status,
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* Header with active org details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Operations Hub
            </span>
            <span className="text-xs text-stone-500">Live dispatcher view</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            {activeOrg.name} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {activeOrg.address}, {activeOrg.city} · Hours: {activeOrg.operating_hours}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOrgNavTab('pending')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Inbox className="w-4 h-4" />
            <span>Review Pending Requests ({pendingRequests.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setOrgNavTab('pending')}
          className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-amber-400 hover:shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Pending Action
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{pendingRequests.length}</div>
          <p className="text-[11px] text-amber-600 font-semibold">Requires Accept / Reject</p>
        </div>

        <div
          onClick={() => setActiveFilter('assigned')}
          className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-sky-400 hover:shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Scheduled Pickups
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{scheduledRequests.length}</div>
          <p className="text-[11px] text-sky-600 font-semibold">Confirmed collection slots</p>
        </div>

        <div
          onClick={() => setActiveFilter('in_progress')}
          className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Active In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{inProgressRequests.length}</div>
          <p className="text-[11px] text-indigo-600 font-semibold">Collectors on field route</p>
        </div>

        <div
          onClick={() => setActiveFilter('completed')}
          className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-emerald-400 hover:shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Completed Handlers
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-stone-900">{completedRequests.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Processed & recovered</p>
        </div>
      </div>

      {/* Expanded Today's Pickups & Schedule (Full 100% Width) */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
        {/* Section Header & Interactive Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
              Today's Pickups & Schedule
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Live facility operational roster, assigned personnel routes, and collection status updates.
            </p>
          </div>

          {/* Quick Filter Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Pickups ({allOperationalPickups.length})
              </button>
              <button
                onClick={() => setActiveFilter('assigned')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'assigned'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Scheduled ({scheduledRequests.length})
              </button>
              <button
                onClick={() => setActiveFilter('in_progress')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'in_progress'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                In Progress ({inProgressRequests.length})
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'completed'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Completed ({completedRequests.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search pickups, staff, citizen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-7 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium w-52 sm:w-60"
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
          </div>
        </div>

        {/* Pickup Cards Grid */}
        {filteredPickups.length === 0 ? (
          <div className="text-center py-12 px-4 bg-stone-50/60 rounded-2xl border border-stone-200/60 space-y-2">
            <Clock className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="text-sm font-extrabold text-stone-900">No pickups found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              There are no collections matching your filter criteria right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPickups.map((req) => {
              const badge = getStatusBadge(req.status);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-300 transition-all shadow-xs space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-xs text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                        #{req.id}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {req.waste_category}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {req.intent === 'sell' ? '💰 Buying / Scrap' : '♻️ Disposal / Recovery'}
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

                  {/* Body Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                    {/* Material & Request Info */}
                    <div className="space-y-1.5">
                      <div className="font-bold text-stone-900 text-sm leading-snug">
                        {req.description}
                      </div>
                      <div className="text-stone-500">
                        Quantity: <strong className="text-stone-700">{req.quantity}</strong>
                      </div>
                      {req.special_instructions && (
                        <div className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                          Note: "{req.special_instructions}"
                        </div>
                      )}
                    </div>

                    {/* Citizen & Location */}
                    <div className="space-y-1.5 text-stone-600 bg-stone-50/70 p-3 rounded-2xl border border-stone-100">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                        <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{req.user_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <a href={`tel:${req.user_phone}`} className="hover:text-emerald-700 font-medium">
                          {req.user_phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-1.5 text-stone-500 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{req.pickup_address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-700 font-semibold pt-1 border-t border-stone-200/60">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {req.pickup_date} · {req.pickup_time}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Collector / Driver Status */}
                    <div className="space-y-2">
                      {req.collector_name ? (
                        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                              <Truck className="w-3 h-3 text-emerald-600" />
                              <span>Assigned Staff Driver</span>
                            </span>
                            <button
                              onClick={() => {
                                setReassignModalReq(req);
                                setSelectedStaffId(req.collector_id || '');
                              }}
                              className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                            >
                              Reassign
                            </button>
                          </div>
                          <div className="font-extrabold text-stone-900 text-sm">
                            {req.collector_name}
                          </div>
                          <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{req.collector_phone}</span>
                          </div>
                          <div className="text-[10px] text-stone-500">
                            Status: <strong className="text-emerald-800">{req.status}</strong>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                          <div className="flex items-center gap-1 text-amber-800 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Staff Unassigned</span>
                          </div>
                          <p className="text-[11px] text-amber-700">
                            Assign an authorized field collector to service this scheduled pickup.
                          </p>
                          <button
                            onClick={() => {
                              setReassignModalReq(req);
                              setSelectedStaffId(collectors[0]?.id || '');
                            }}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            Assign Collector Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                    <div className="text-[11px] text-stone-400">
                      Slot: {req.pickup_date} ({req.pickup_time}) · {req.pickup_method}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedRequestForJourney(req)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-600" />
                        <span>Track Journey</span>
                      </button>

                      {/* Quick Progression Buttons for Organization Dispatch */}
                      {req.status === 'Collector Assigned' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Pickup In Progress', 'Staff dispatched on vehicle route')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch En Route</span>
                        </button>
                      )}

                      {req.status === 'Pickup In Progress' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Completed', 'Weighed & material collected')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Pickup Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Staff Reassignment Modal */}
      {reassignModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-stone-900">
                  Assign Staff to #{reassignModalReq.id}
                </h3>
              </div>
              <button
                onClick={() => setReassignModalReq(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 text-xs space-y-1 border border-stone-200/80">
              <div className="font-bold text-stone-900">{reassignModalReq.description}</div>
              <div className="text-stone-500">
                {reassignModalReq.user_name} · {reassignModalReq.pickup_address}
              </div>
            </div>

            <form onSubmit={handleReassignStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Select Field Personnel
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {collectors.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedStaffId(c.id)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedStaffId === c.id
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-stone-900 flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {selectedStaffId === c.id && (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {c.phone} · {c.vehicle_type?.split('(')[0] || 'Vehicle'}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.availability === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.availability === 'On Pickup'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {c.availability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setReassignModalReq(null)}
                  className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStaffId}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Confirm Staff Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
