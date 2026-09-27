import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem, RequestStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  Star,
  Check,
  ChevronRight,
  Phone,
  Package,
} from 'lucide-react';

export const OrgSchedule: React.FC = () => {
  const {
    activeOrg,
    requests,
    collectors,
    updateRequestStatus,
    assignCollector,
    feedbacks,
    setSelectedRequestForJourney,
  } = useApp();

  const [statusTab, setStatusTab] = useState<'All' | 'Scheduled' | 'In Progress' | 'Completed'>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [collectorFilter, setCollectorFilter] = useState<string>('All');
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const orgRequests = requests.filter(
    (r) => r.organization_id === activeOrg.id && r.status !== 'Rejected' && r.status !== 'Cancelled'
  );

  // Extract distinct dates
  const uniqueDates = Array.from(new Set(orgRequests.map((r) => r.pickup_date))).sort();

  const filteredRequests = orgRequests.filter((r) => {
    // Status tab filter
    if (statusTab === 'Scheduled') {
      if (r.status !== 'Scheduled' && r.status !== 'Collector Assigned' && r.status !== 'Accepted') return false;
    } else if (statusTab === 'In Progress') {
      if (r.status !== 'Pickup In Progress' && r.status !== 'Picked Up') return false;
    } else if (statusTab === 'Completed') {
      if (r.status !== 'Completed') return false;
    }

    if (dateFilter !== 'All' && r.pickup_date !== dateFilter) return false;
    if (collectorFilter !== 'All' && r.collector_id !== collectorFilter) return false;
    return true;
  });

  const handleAssign = (requestId: string, collectorId: string) => {
    assignCollector(requestId, collectorId);
    setAssigningRequestId(null);
    showToast('Staff assigned to pickup schedule!');
  };

  const handleAdvanceStatus = (req: RequestItem, nextStatus: RequestStatus, note: string) => {
    updateRequestStatus(req.id, nextStatus, note);
    if (nextStatus === 'Completed') {
      showToast(`Collection #${req.id} marked Completed! Customer invited to rate & review.`);
    } else {
      showToast(`Status updated to ${nextStatus}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-3 animate-slideUp text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
              Dispatch & Logistics
            </span>
            <span className="text-xs text-stone-500">{activeOrg.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Pickup Logistics & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage dispatch routes, assign field collectors, and mark collections completed.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="All">All Scheduled Dates</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                📅 {d}
              </option>
            ))}
          </select>

          {/* Collector Filter */}
          <select
            value={collectorFilter}
            onChange={(e) => setCollectorFilter(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="All">All Staff Personnel</option>
            {collectors.map((c) => (
              <option key={c.id} value={c.id}>
                👤 {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {(['All', 'Scheduled', 'In Progress', 'Completed'] as const).map((tab) => {
          const count = orgRequests.filter((r) => {
            if (tab === 'All') return true;
            if (tab === 'Scheduled') return r.status === 'Scheduled' || r.status === 'Collector Assigned' || r.status === 'Accepted';
            if (tab === 'In Progress') return r.status === 'Pickup In Progress' || r.status === 'Picked Up';
            if (tab === 'Completed') return r.status === 'Completed';
            return false;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusTab === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusTab === tab ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 text-stone-400 text-xs space-y-2">
            <Package className="w-10 h-10 text-stone-300 mx-auto" />
            <div className="font-bold text-stone-700">No pickups matching "{statusTab}"</div>
            <p className="text-[11px] text-stone-400">Try switching filters or review incoming pending requests.</p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isUnassigned = !req.collector_name && req.status !== 'Completed';
            const reqFeedback = feedbacks.find((f) => f.request_id === req.id);

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                  isUnassigned
                    ? 'border-amber-300 bg-amber-50/20'
                    : req.status === 'Completed'
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-stone-200 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Time slot indicator */}
                  <div className="w-20 text-center shrink-0 bg-stone-100 p-2.5 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 block uppercase">Time</span>
                    <span className="text-xs font-extrabold text-stone-900 block mt-0.5">
                      {req.pickup_time.split('–')[0].trim()}
                    </span>
                    <span className="text-[10px] text-stone-400 block">{req.pickup_date.split('-').slice(1).join('/')}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        #{req.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800">
                        {req.waste_category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          req.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : req.status === 'Pickup In Progress'
                            ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                            : req.status === 'Picked Up'
                            ? 'bg-teal-100 text-teal-800'
                            : isUnassigned
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-[10px] font-medium text-stone-500">
                        {req.intent === 'sell' ? '💰 Buying Request' : '♻️ Disposal & Recovery'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                      {req.description} ({req.quantity})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Customer: <strong>{req.user_name}</strong> ({req.user_phone})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{req.pickup_address}</span>
                      </div>
                      {req.collector_name && (
                        <div className="flex items-center gap-1.5 text-sky-800 col-span-1 sm:col-span-2 pt-0.5">
                          <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>Staff Assigned: <strong>{req.collector_name}</strong> ({req.collector_phone})</span>
                        </div>
                      )}
                    </div>

                    {/* Customer Review display if completed and reviewed */}
                    {req.status === 'Completed' && reqFeedback && (
                      <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Customer Review: {reqFeedback.rating}/5 Stars</span>
                          </span>
                          <span className="text-[10px] text-stone-400">{reqFeedback.createdAt.split('T')[0]}</span>
                        </div>
                        <p className="text-stone-700 italic">"{reqFeedback.comment}"</p>
                      </div>
                    )}

                    {req.status === 'Completed' && !reqFeedback && (
                      <div className="text-[11px] text-stone-500 flex items-center gap-1.5 bg-stone-50 p-2 rounded-xl">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>Collection finished · Waiting for customer rating & review</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logistics Controls & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 border-stone-100 pt-3 lg:pt-0 shrink-0 min-w-56">
                  {/* Staff Assignment */}
                  {req.status !== 'Completed' && (
                    <div className="w-full">
                      {assigningRequestId === req.id ? (
                        <div className="space-y-1.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                          <label className="text-[10px] font-bold text-stone-600 block uppercase">
                            Select Field Staff
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleAssign(req.id, e.target.value);
                            }}
                            defaultValue=""
                            className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="" disabled>Choose staff collector...</option>
                            {collectors.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.availability})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setAssigningRequestId(null)}
                            className="text-[10px] text-stone-500 hover:text-stone-800 font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningRequestId(req.id)}
                          className={`w-full text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            isUnassigned
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{req.collector_name ? 'Change Staff' : 'Assign Field Staff ⚠️'}</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Operational Progression Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full justify-end">
                    {/* If Scheduled or Collector Assigned -> Start Pickup */}
                    {(req.status === 'Scheduled' || req.status === 'Collector Assigned' || req.status === 'Accepted') && (
                      <button
                        onClick={() => handleAdvanceStatus(req, 'Pickup In Progress', 'Collector dispatched and en route to user location')}
                        className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Start Route</span>
                      </button>
                    )}

                    {/* If Pickup In Progress -> Mark Picked Up */}
                    {req.status === 'Pickup In Progress' && (
                      <button
                        onClick={() => handleAdvanceStatus(req, 'Picked Up', 'Material weighed, inspected, and loaded into transport vehicle')}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Confirm Loaded</span>
                      </button>
                    )}

                    {/* If Picked Up or In Progress -> Complete Collection */}
                    {(req.status === 'Picked Up' || req.status === 'Pickup In Progress') && (
                      <button
                        onClick={() => handleAdvanceStatus(req, 'Completed', 'Material safely recovered at processing facility')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        title="Mark Collection Completed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Collection</span>
                      </button>
                    )}

                    {/* View Details / Journey Button */}
                    <button
                      onClick={() => setSelectedRequestForJourney(req)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
