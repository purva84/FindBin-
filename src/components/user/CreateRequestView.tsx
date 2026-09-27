import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, UserIntent, Organization, RequestItem } from '../../types';
import { RULE_BASED_TIPS } from '../../data/mockData';
import {
  CheckCircle2,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Truck,
  ArrowRight,
  ArrowLeft,
  Upload,
  Info,
  DollarSign,
  Recycle,
  Star,
  ChevronRight,
  Check,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES: { label: WasteCategory; icon: string; desc: string }[] = [
  { label: 'E-Waste', icon: '💻', desc: 'Computers, phones, gadgets, cables & circuitry' },
  { label: 'Battery / Hazardous', icon: '⚡', desc: 'Lead-acid, lithium cells, chemical & inverter batteries' },
  { label: 'Textile', icon: '👕', desc: 'Clothes, denim, bedsheets, curtains & fabrics' },
  { label: 'Plastic', icon: '🧴', desc: 'Bottles, containers, crates, HDPE cans & packaging' },
  { label: 'Paper & Cardboard', icon: '📦', desc: 'Cartons, office files, books & newspapers' },
  { label: 'Metal', icon: '🔧', desc: 'Copper, aluminum, brass, iron scrap & fixtures' },
  { label: 'Glass', icon: '🍾', desc: 'Clean bottles, jars, glass cullet' },
  { label: 'Wet / Organic Waste', icon: '🍎', desc: 'Kitchen peels, coffee grounds, garden prunings' },
  { label: 'Mixed Waste', icon: '🗑️', desc: 'Segregated household dry mixed recyclables' },
  { label: 'Other', icon: '♻️', desc: 'Miscellaneous non-standard materials' },
];

export const CreateRequestView: React.FC = () => {
  const {
    user,
    organizations,
    createRequest,
    setUserNavTab,
    setSelectedRequestForJourney,
    setSelectedOrgForDetails,
    preselectedOrgForRequest,
    setPreselectedOrgForRequest,
  } = useApp();

  // Wizard Steps: 1: Details & Category -> 2: Intent & Method -> 3: Match Organizations -> 4: Review & Confirm
  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<WasteCategory>('E-Waste');
  const [description, setDescription] = useState('Old laptop with charger and damaged battery');
  const [quantity, setQuantity] = useState('1 item (approx 2.5 kg)');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [intent, setIntent] = useState<UserIntent>('dispose');
  const [pickupMethod, setPickupMethod] = useState<'Doorstep Pickup' | 'Drop-off'>('Doorstep Pickup');
  const [pickupAddress, setPickupAddress] = useState(user.address);
  const [pickupDate, setPickupDate] = useState('2026-09-28');
  const [pickupTime, setPickupTime] = useState('10:00 AM – 12:00 PM');
  const [instructions, setInstructions] = useState('Please call before arriving.');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(preselectedOrgForRequest || null);
  const [submittedRequest, setSubmittedRequest] = useState<RequestItem | null>(null);

  // If navigated from Organization card with preselectedOrg
  useEffect(() => {
    if (preselectedOrgForRequest) {
      setSelectedOrg(preselectedOrgForRequest);
      if (preselectedOrgForRequest.accepted_categories.length > 0) {
        setCategory(preselectedOrgForRequest.accepted_categories[0]);
      }
    }
  }, [preselectedOrgForRequest]);

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Rule-based Organization Matching
  const matchingOrgs = organizations.filter((org) => {
    // 1. Must accept the selected waste category
    const acceptsCategory = org.accepted_categories.includes(category);
    if (!acceptsCategory) return false;

    // 2. If user wants to sell, org must support buying
    if (intent === 'sell' && !org.buying_available) return false;

    // 3. Must support chosen method
    if (pickupMethod === 'Doorstep Pickup' && !org.pickup_available) return false;
    if (pickupMethod === 'Drop-off' && !org.dropoff_available) return false;

    return true;
  });

  const handleConfirmSubmit = () => {
    if (!selectedOrg) return;

    const newReq = createRequest({
      user_id: user.id,
      user_name: user.name,
      user_phone: user.phone,
      organization_id: selectedOrg.id,
      organization_name: selectedOrg.name,
      waste_category: category,
      description,
      quantity,
      intent,
      pickup_method: pickupMethod,
      pickup_address: pickupAddress,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      image_url: imagePreview || undefined,
      special_instructions: instructions,
    });

    setSubmittedRequest(newReq);
    setPreselectedOrgForRequest(null);
  };

  // SUCCESS SCREEN
  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Request Submitted Successfully
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 mt-2">
              Request #{submittedRequest.id}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Your request has been dispatched to <strong>{submittedRequest.organization_name}</strong>.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500 font-medium">Material:</span>
              <span className="font-bold text-stone-800">{submittedRequest.description}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500 font-medium">Category:</span>
              <span className="font-bold text-stone-800">{submittedRequest.waste_category}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500 font-medium">Handling Intent:</span>
              <span className="font-bold text-stone-800 capitalize">
                {submittedRequest.intent === 'sell' ? '💰 Sell for scrap value' : '♻️ Give for responsible recycling'}
              </span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500 font-medium">Organization:</span>
              <span className="font-bold text-emerald-700">{submittedRequest.organization_name}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500 font-medium">Slot:</span>
              <span className="font-bold text-stone-800">{submittedRequest.pickup_date} · {submittedRequest.pickup_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Address:</span>
              <span className="font-semibold text-stone-800 text-right max-w-xs">{submittedRequest.pickup_address}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSelectedRequestForJourney(submittedRequest);
                setUserNavTab('dashboard');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Request Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedRequest(null);
                setStep(1);
                setSelectedOrg(null);
              }}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              Create Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
      {/* Back button */}
      <div>
        <button
          onClick={() => setUserNavTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Step Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Step {step} of 4: {step === 1 ? 'Item & Category' : step === 2 ? 'Intent & Schedule' : step === 3 ? 'Choose Organization' : 'Review & Confirm'}
          </span>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {Math.round((step / 4) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-extrabold text-stone-900">What do you have?</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Select the category that best describes your material.
              </p>
            </div>

            {/* Waste Category Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                Waste Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{cat.icon}</div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-stone-800'}`}>
                          {cat.label}
                        </div>
                        <div className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">
                          {cat.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Description of Material <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: Old laptop with charger and damaged battery"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[11px] text-stone-600">Be as specific as possible to help organizations prepare equipment.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Approximate Quantity <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 1 item, 5 kg, 2 large boxes"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[11px] text-stone-600">e.g. 1 item, 5 kg, 2 boxes</span>
              </div>
            </div>

            {/* Optional Photo Upload */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Optional Material Photo
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-stone-300 rounded-xl text-xs font-medium text-stone-600 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-stone-500" />
                  <span>{imagePreview ? 'Replace Photo' : 'Upload photo (JPG/PNG)'}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Material preview"
                      className="w-14 h-14 object-cover rounded-xl border border-stone-200"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white rounded-full p-0.5 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rule-based Contextual FindBin Tip */}
            {RULE_BASED_TIPS[category] && (
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    ♻️ FindBin Tip for {category}
                  </h4>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                    {RULE_BASED_TIPS[category]}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!description.trim()) {
                    alert('Please provide a description of the material.');
                    return;
                  }
                  setStep(2);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Continue: Intent & Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-extrabold text-stone-900">What would you like to do?</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Choose how you want organizations to handle your item.
              </p>
            </div>

            {/* Intent Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIntent('sell')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  intent === 'sell'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💰</span>
                  {intent === 'sell' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-stone-900 text-sm">Sell for Scrap / Residual Value</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  "I want an organization that may buy this material and offer digital or cash payout."
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIntent('dispose')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  intent === 'dispose'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">♻️</span>
                  {intent === 'dispose' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-stone-900 text-sm">Give for Collection / Disposal</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  "I want an authorized organization to collect, donate, or responsibly recycle this material."
                </p>
              </button>
            </div>

            {/* Pickup vs Drop-off Preference */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Handover Method
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setPickupMethod('Doorstep Pickup')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    pickupMethod === 'Doorstep Pickup'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs">Doorstep Pickup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupMethod('Drop-off')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    pickupMethod === 'Drop-off'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs">Self Drop-off</span>
                </button>
              </div>
            </div>

            {/* Address & Slot */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {pickupMethod === 'Doorstep Pickup' ? 'Pickup Address' : 'Your Contact Address'}
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Additional Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Please call 10 minutes before arriving at the gate."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-stone-600 hover:text-stone-900 font-semibold text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Find Matching Organizations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <span>Category: <strong>{category}</strong></span>
                <span>•</span>
                <span>Intent: <strong>{intent === 'sell' ? 'Sell 💰' : 'Dispose ♻️'}</strong></span>
                <span>•</span>
                <span>Method: <strong>{pickupMethod}</strong></span>
              </div>
              <h2 className="text-xl font-extrabold text-stone-900">
                Organizations for {category}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Rule-matched organizations offering certified handling for your request.
              </p>
            </div>

            {/* List of matching org cards */}
            {matchingOrgs.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 p-6">
                <Building2 className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <h4 className="font-bold text-stone-800 text-sm">No exact organization matched your combination</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try changing your intent (e.g. from Sell to Give for collection) or choosing Self Drop-off.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Adjust Preferences
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingOrgs.map((org) => {
                  const isSelected = selectedOrg?.id === org.id;
                  return (
                    <div
                      key={org.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                              Demo Certified
                            </span>
                            <h3 className="font-extrabold text-stone-900 text-base">
                              {org.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-lg text-xs font-bold border border-amber-200/60 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{org.rating}</span>
                            <span className="text-[10px] text-amber-700 font-normal">({org.review_count})</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2">
                          {org.description}
                        </p>

                        {/* Accepts */}
                        <div className="text-[11px] text-stone-600 space-y-1">
                          <div className="font-semibold text-stone-700">Accepts:</div>
                          <div className="flex flex-wrap gap-1">
                            {org.accepted_categories.map((c) => (
                              <span
                                key={c}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  c === category ? 'bg-emerald-200/80 text-emerald-900 font-bold' : 'bg-stone-100 text-stone-600'
                                }`}
                              >
                                ✓ {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Services */}
                        <div className="flex flex-wrap gap-2 text-[11px] text-stone-600 pt-1">
                          {org.pickup_available && (
                            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                              🚚 Doorstep Pickup
                            </span>
                          )}
                          {org.dropoff_available && (
                            <span className="flex items-center gap-1 text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                              🏢 Drop-off
                            </span>
                          )}
                          {org.buying_available && (
                            <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                              💰 Buying / Scrap Payment
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {org.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {org.operating_hours.split('(')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrgForDetails(org)}
                          className="text-stone-600 hover:text-stone-900 text-xs font-semibold px-2 py-1.5 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrg(org);
                            setStep(4);
                          }}
                          className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-900 hover:bg-stone-800 text-white'
                          }`}
                        >
                          <span>Request Pickup</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-stone-600 hover:text-stone-900 font-semibold text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Schedule</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && selectedOrg && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-extrabold text-stone-900">Confirm Your Request</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Review the request summary before dispatching to {selectedOrg.name}.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Waste Item</span>
                  <span className="font-extrabold text-stone-900 text-sm block">{description}</span>
                  <span className="text-stone-600 text-[11px]">{quantity}</span>
                </div>

                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Category & Intent</span>
                  <span className="font-bold text-stone-900 block">{category}</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    {intent === 'sell' ? '💰 Sell for scrap value' : '♻️ Give for collection / recycling'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Assigned Organization</span>
                  <span className="font-bold text-stone-900 block">{selectedOrg.name}</span>
                  <span className="text-stone-500 text-[11px]">⭐ {selectedOrg.rating} rating · {selectedOrg.completed_requests_count} completed</span>
                </div>

                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Scheduled Slot</span>
                  <span className="font-bold text-stone-900 block">{pickupDate}</span>
                  <span className="text-stone-600 text-[11px]">{pickupTime} ({pickupMethod})</span>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-stone-200">
                  <span className="text-stone-500 font-medium block mb-0.5">Pickup Address</span>
                  <span className="font-semibold text-stone-800">{pickupAddress}</span>
                </div>

                {instructions && (
                  <div className="sm:col-span-2">
                    <span className="text-stone-500 font-medium block mb-0.5">Special Instructions</span>
                    <span className="text-stone-700 italic">"{instructions}"</span>
                  </div>
                )}
              </div>

              {/* What happens to your material snippet */}
              <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5 mb-1 text-emerald-800">
                  <Recycle className="w-3.5 h-3.5 text-emerald-600" />
                  What happens to your material at {selectedOrg.name}?
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {selectedOrg.processing_description}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-stone-600 hover:text-stone-900 font-semibold text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Organization</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Request</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
