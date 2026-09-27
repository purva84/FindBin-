import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem } from '../../types';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Truck,
  Building2,
  X,
  AlertCircle,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

export const OrgPendingRequests: React.FC = () => {
  const {
    activeOrg,
    requests,
    collectors,
    acceptRequest,
    rejectRequest,
    setOrgNavTab,
  } = useApp();

  const pendingRequests = requests.filter(
    (r) => r.organization_id === activeOrg.id && r.status === 'Pending'
  );

  // Accept Modal State with Detailed Fields and Staff Assignment
  const [acceptingReq, setAcceptingReq] = useState<RequestItem | null>(null);
  const [confirmDate, setConfirmDate] = useState('');
  const [confirmTime, setConfirmTime] = useState('');
  const [confirmMethod, setConfirmMethod] = useState<'Doorstep Pickup' | 'Drop-off'>('Doorstep Pickup');
  const [instructions, setInstructions] = useState('');
  const [selectedCollectorId, setSelectedCollectorId] = useState('');

  // Reject Modal State
  const [rejectingReq, setRejectingReq] = useState<RequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleOpenAccept = (req: RequestItem) => {
    setAcceptingReq(req);
    setConfirmDate(req.pickup_date);
    setConfirmTime(req.pickup_time);
    setConfirmMethod(req.pickup_method);
    setInstructions(
      req.special_instructions
        ? `Customer note: "${req.special_instructions}". Certified scale and protective container will be dispatched.`
        : 'Our team will bring certified digital scales and safe packaging.'
    );

    // Pick first available collector as default
    const availableStaff = collectors.find((c) => c.availability === 'Available') || collectors[0];
    setSelectedCollectorId(availableStaff ? availableStaff.id : '');
  };

  const handleConfirmAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingReq) return;

    acceptRequest(
      acceptingReq.id,
      confirmDate,
      confirmTime,
      confirmMethod,
      instructions,
      selectedCollectorId || undefined
    );
    setAcceptingReq(null);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReq || !rejectReason.trim()) return;

    rejectRequest(rejectingReq.id, rejectReason.trim());
    setRejectingReq(null);
    setRejectReason('');
  };

  const chosenCollector = collectors.find((c) => c.id === selectedCollectorId);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Incoming Queue
          </span>
          <span className="text-xs text-stone-500">{activeOrg.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Pending Material Requests
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Review incoming requests, verify material category suitability, assign field personnel, and confirm collection windows.
        </p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-stone-800 text-base">All Caught Up!</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            There are no pending requests waiting for approval for {activeOrg.name}.
          </p>
          <button
            onClick={() => setOrgNavTab('dashboard')}
            className="mt-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
          >
            View Dashboard & Today's Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-stone-100 text-stone-900 px-2 py-0.5 rounded">
                    #{req.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    {req.waste_category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                    {req.intent === 'sell' ? '💰 Buying / Scrap Request' : '♻️ Collection / Disposal'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-stone-900">
                    {req.description}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 font-medium">
                    Quantity: <strong className="text-stone-800">{req.quantity}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Citizen: <strong>{req.user_name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`tel:${req.user_phone}`} className="hover:text-emerald-700 font-medium">
                      {req.user_phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Requested: <strong>{req.pickup_date} ({req.pickup_time})</strong></span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{req.pickup_address}</span>
                  </div>
                </div>

                {req.special_instructions && (
                  <p className="text-xs text-stone-500 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50">
                    Citizen Note: "{req.special_instructions}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col items-center gap-2.5 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleOpenAccept(req)}
                  className="w-full sm:w-auto md:w-44 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept & Assign Staff</span>
                </button>

                <button
                  onClick={() => setRejectingReq(req)}
                  className="w-full sm:w-auto md:w-44 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Decline Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPREHENSIVE ACCEPT & ASSIGN STAFF MODAL */}
      {acceptingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-white text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
                    #{acceptingReq.id}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800">
                    {acceptingReq.waste_category}
                  </span>
                </div>
                <h3 className="font-extrabold text-stone-900 text-base sm:text-lg mt-1">
                  Accept & Assign Field Staff
                </h3>
              </div>
              <button
                onClick={() => setAcceptingReq(null)}
                className="p-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 border border-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAccept} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* Detailed Request Summary Box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  Material & Citizen Details
                </span>

                <div className="font-bold text-stone-900 text-sm">
                  {acceptingReq.description}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600 pt-1">
                  <div>
                    <span className="text-stone-400">Citizen:</span>{' '}
                    <strong className="text-stone-800">{acceptingReq.user_name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Phone:</span>{' '}
                    <strong className="text-stone-800">{acceptingReq.user_phone}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Quantity:</span>{' '}
                    <strong className="text-stone-800">{acceptingReq.quantity}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Intent:</span>{' '}
                    <strong className="text-stone-800 capitalize">
                      {acceptingReq.intent === 'sell' ? '💰 Scrap Purchase' : '♻️ Recycling'}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-400">Address:</span>{' '}
                    <span className="text-stone-800 font-medium">{acceptingReq.pickup_address}</span>
                  </div>
                  {acceptingReq.special_instructions && (
                    <div className="sm:col-span-2 text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200">
                      User Instructions: "{acceptingReq.special_instructions}"
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Confirmation */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  1. Confirm Pickup Window & Logistics
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Confirmed Date
                    </label>
                    <input
                      type="date"
                      value={confirmDate}
                      onChange={(e) => setConfirmDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Confirmed Time Slot
                    </label>
                    <select
                      value={confirmTime}
                      onChange={(e) => setConfirmTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                    >
                      <option value="9:00 AM – 11:00 AM">9:00 AM – 11:00 AM</option>
                      <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                      <option value="12:00 PM – 2:00 PM">12:00 PM – 2:00 PM</option>
                      <option value="2:00 PM – 4:00 PM">2:00 PM – 4:00 PM</option>
                      <option value="4:00 PM – 6:00 PM">4:00 PM – 6:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Pickup Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmMethod('Doorstep Pickup')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                        confirmMethod === 'Doorstep Pickup'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      🚚 Doorstep Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmMethod('Drop-off')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                        confirmMethod === 'Drop-off'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      🏢 Facility Drop-off
                    </button>
                  </div>
                </div>
              </div>

              {/* Staff / Collector Assignment */}
              <div className="space-y-2.5 border-t border-stone-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">
                    2. Assign Field Driver / Collector Staff
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {collectors.filter((c) => c.availability === 'Available').length} staff available
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {collectors.map((c) => {
                    const isSelected = selectedCollectorId === c.id;
                    const isAvail = c.availability === 'Available';

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCollectorId(c.id)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold text-stone-900">
                            <span>{c.name}</span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-emerald-600 font-black" />
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                            <Truck className="w-3 h-3 text-stone-400" />
                            <span>{c.vehicle_type?.split('(')[0] || 'Vehicle'}</span>
                            <span>•</span>
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{c.phone}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAvail
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.availability === 'On Pickup'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {c.availability}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions / Notes */}
              <div className="space-y-1 border-t border-stone-200 pt-4">
                <label className="block font-bold text-stone-700">
                  Facility Instructions for Citizen & Assigned Staff
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium text-xs"
                  placeholder="e.g. Bring calibrated battery scale, wear nitrile gloves..."
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-stone-500">
                  {chosenCollector ? (
                    <span>
                      Assigning to <strong>{chosenCollector.name}</strong>
                    </span>
                  ) : (
                    <span>No staff selected</span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setAcceptingReq(null)}
                    className="px-4 py-2 font-bold text-stone-600 hover:text-stone-900 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept & Assign Staff</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL WITH REQUIRED REASON */}
      {rejectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-stone-900 text-base">
                  Decline Request #{rejectingReq.id}
                </h3>
              </div>
              <button
                onClick={() => setRejectingReq(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4 text-xs">
              <p className="text-stone-600">
                Please provide the citizen with a specific reason for rejection so they can repackage, segregate, or find an alternative handler.
              </p>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Reason for Rejection <span className="text-rose-600">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Hazardous chemicals mixed with dry paper; or outside our municipal pickup radius..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-medium"
                />
              </div>

              {/* Preset Quick Reasons */}
              <div>
                <span className="text-[11px] font-bold text-stone-500 block mb-1">
                  Quick Preset Reasons:
                </span>
                <div className="space-y-1">
                  {[
                    'Contains hazardous or unsegregated items requiring separate disposal.',
                    'Material quantity is below our minimum doorstep threshold (5 kg).',
                    'Address falls outside our certified operational district.',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectReason(preset)}
                      className="text-left text-[11px] text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 p-2 rounded-xl w-full block transition-colors cursor-pointer"
                    >
                      • {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingReq(null)}
                  className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
