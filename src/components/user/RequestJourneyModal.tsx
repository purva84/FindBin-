import React from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem, RequestStatus } from '../../types';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Phone,
  User,
  Calendar,
  MapPin,
  X,
  Truck,
  MessageSquare,
  Star,
  AlertTriangle,
} from 'lucide-react';

interface RequestJourneyModalProps {
  request: RequestItem | null;
  onClose: () => void;
  onOpenFeedback: (req: RequestItem) => void;
  onOpenComplaint: (req: RequestItem) => void;
}

const JOURNEY_STEPS: { status: RequestStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Request Submitted', desc: 'Dispatched to organization' },
  { status: 'Accepted', label: 'Organization Accepted', desc: 'Material eligibility verified' },
  { status: 'Scheduled', label: 'Date & Slot Confirmed', desc: 'Pickup calendar slot locked' },
  { status: 'Collector Assigned', label: 'Collector Assigned', desc: 'Field staff dispatched' },
  { status: 'Pickup In Progress', label: 'Pickup In Progress', desc: 'Collector en route' },
  { status: 'Picked Up', label: 'Collected', desc: 'Material weighed & loaded' },
  { status: 'Completed', label: 'Completed', desc: 'Processed at facility' },
];

export const RequestJourneyModal: React.FC<RequestJourneyModalProps> = ({
  request,
  onClose,
  onOpenFeedback,
  onOpenComplaint,
}) => {
  const { feedbacks } = useApp();

  if (!request) return null;

  const isRejected = request.status === 'Rejected';
  const isCancelled = request.status === 'Cancelled';
  const isCompleted = request.status === 'Completed';

  // Determine current step index in normal progression
  const getStepIndex = (status: RequestStatus): number => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Accepted':
        return 1;
      case 'Scheduled':
        return 2;
      case 'Collector Assigned':
        return 3;
      case 'Pickup In Progress':
        return 4;
      case 'Picked Up':
        return 5;
      case 'Completed':
        return 6;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(request.status);
  const existingFeedback = feedbacks.find((f) => f.request_id === request.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                #{request.id}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800'
                    : isRejected
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {request.status}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-stone-900">
              {request.description}
            </h2>
            <p className="text-xs text-stone-500">
              {request.waste_category} · Handled by <strong>{request.organization_name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Rejection Notice */}
          {isRejected && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Request Declined by Organization</span>
              </div>
              <p className="text-xs leading-relaxed">
                <strong>Reason: </strong>
                {request.rejection_reason || 'The organization cannot handle this material in its current condition.'}
              </p>
            </div>
          )}

          {/* Cancellation Notice */}
          {isCancelled && (
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 text-stone-800">
              <div className="font-bold text-xs">Request Cancelled</div>
              <p className="text-xs text-stone-600 mt-1">This request was cancelled by user.</p>
            </div>
          )}

          {/* Request Journey Timeline */}
          {!isRejected && !isCancelled && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                Request Journey Timeline
              </h3>

              <div className="space-y-4 relative pl-3">
                {JOURNEY_STEPS.map((step, idx) => {
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  // Find log note if available
                  const historyItem = request.timeline?.find((t) => t.status === step.status);

                  return (
                    <div key={step.status} className="flex items-start gap-3.5 relative">
                      {/* Connecting Line */}
                      {idx < JOURNEY_STEPS.length - 1 && (
                        <div
                          className={`absolute left-3 top-6 w-0.5 h-10 -ml-px transition-colors ${
                            currentStepIdx > idx ? 'bg-emerald-600' : 'bg-stone-200'
                          }`}
                        />
                      )}

                      {/* Icon Bullet */}
                      <div className="relative z-10 shrink-0 mt-0.5">
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-300 text-stone-400 flex items-center justify-center">
                            <Circle className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Label & Details */}
                      <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isDone ? 'text-stone-900' : 'text-stone-400'
                            } ${isCurrent ? 'text-emerald-800 font-extrabold' : ''}`}
                          >
                            {step.label}
                          </span>
                          {historyItem && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              {historyItem.timestamp}
                            </span>
                          )}
                        </div>

                        <p className={`text-[11px] ${isDone ? 'text-stone-500' : 'text-stone-400'}`}>
                          {historyItem?.note || step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 20: Collector Details Card (when assigned) */}
          {request.collector_name && (
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider bg-sky-100 px-2 py-0.5 rounded">
                  Assigned Collector
                </span>
                <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Doorstep Staff</span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {request.collector_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-sm">{request.collector_name}</h4>
                    <p className="text-[11px] text-stone-500">Pickup Staff · Verified ID</p>
                  </div>
                </div>

                {request.collector_phone && (
                  <a
                    href={`tel:${request.collector_phone}`}
                    className="flex items-center gap-1.5 bg-white border border-sky-300 text-sky-800 hover:bg-sky-50 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>{request.collector_phone}</span>
                  </a>
                )}
              </div>

              <div className="text-[11px] text-sky-900 border-t border-sky-200/80 pt-2 flex items-center justify-between">
                <span>Scheduled slot: <strong>{request.pickup_date} · {request.pickup_time}</strong></span>
                <span className="font-semibold text-emerald-700">Status: {request.collector_status || 'Assigned'}</span>
              </div>
            </div>
          )}

          {/* Handover Details */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">Pickup Address:</span>
              <span className="font-semibold text-stone-800 max-w-xs text-right">{request.pickup_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Quantity:</span>
              <span className="font-semibold text-stone-800">{request.quantity}</span>
            </div>
            {request.special_instructions && (
              <div className="flex justify-between">
                <span className="text-stone-500">Instructions:</span>
                <span className="font-medium text-stone-700 italic">"{request.special_instructions}"</span>
              </div>
            )}
          </div>

          {/* Prompt to rate if completed and not yet submitted */}
          {isCompleted && !existingFeedback && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs space-y-3 animate-fadeIn">
              <div className="space-y-0.5">
                <div className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Collection Completed! How was your experience?</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Rate punctuality, communication, and material handling for <strong>{request.organization_name}</strong>.
                </p>
              </div>
              <button
                onClick={() => onOpenFeedback(request)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Rate & Review Collection Now ⭐</span>
              </button>
            </div>
          )}

          {/* Existing Feedback View (if submitted) */}
          {existingFeedback && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Your Submitted Feedback:</span>
                <div className="flex text-amber-500 font-bold">
                  {'★'.repeat(existingFeedback.rating)}
                  {'☆'.repeat(5 - existingFeedback.rating)}
                </div>
              </div>
              <p className="text-stone-700 italic">"{existingFeedback.comment}"</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenComplaint(request)}
            className="text-stone-600 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Issue / Complaint</span>
          </button>

          <div className="flex items-center gap-2">
            {isCompleted && !existingFeedback && (
              <button
                onClick={() => onOpenFeedback(request)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Rate Experience</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
