import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, ServiceType } from '../../types';
import { Building, Save, CheckCircle2, Recycle } from 'lucide-react';

const ALL_CATEGORIES: WasteCategory[] = [
  'Wet / Organic Waste',
  'Plastic',
  'Paper & Cardboard',
  'Glass',
  'Metal',
  'Textile',
  'E-Waste',
  'Battery / Hazardous',
  'Mixed Waste',
  'Other',
];

const ALL_SERVICES: { type: ServiceType; label: string; desc: string }[] = [
  { type: 'doorstep_pickup', label: 'Doorstep Pickup', desc: 'Dispatch vehicles to collect directly from homes/offices' },
  { type: 'dropoff', label: 'Self Drop-off Facility', desc: 'Accept physical handovers at depot during business hours' },
  { type: 'buying', label: 'Buy Materials / Scrap Payout', desc: 'Provide digital UPI or cash compensation for recyclable bulk' },
  { type: 'repair', label: 'Refurbish & Repair', desc: 'Fix salvageable appliances, electronics or textiles' },
  { type: 'donation', label: 'Donation & Community Distribution', desc: 'Redirect wearable clothing or goods to welfare programs' },
  { type: 'recycling', label: 'Industrial Material Recycling', desc: 'Process scrap into secondary raw commodities' },
  { type: 'specialized_handling', label: 'Certified Hazmat Handling', desc: 'Neutralize corrosive batteries, lead, or bio-chemicals safely' },
];

export const OrgProfile: React.FC = () => {
  const { activeOrg, updateOrganizationProfile, logout } = useApp();

  const [name, setName] = useState(activeOrg.name);
  const [tagline, setTagline] = useState(activeOrg.tagline || '');
  const [description, setDescription] = useState(activeOrg.description);
  const [contactNumber, setContactNumber] = useState(activeOrg.contact_number);
  const [email, setEmail] = useState(activeOrg.email);
  const [address, setAddress] = useState(activeOrg.address);
  const [city, setCity] = useState(activeOrg.city);
  const [operatingHours, setOperatingHours] = useState(activeOrg.operating_hours);
  const [acceptedCategories, setAcceptedCategories] = useState<WasteCategory[]>(activeOrg.accepted_categories);
  const [services, setServices] = useState<ServiceType[]>(activeOrg.services);
  const [processingDescription, setProcessingDescription] = useState(activeOrg.processing_description);
  const [savedMsg, setSavedMsg] = useState(false);

  const toggleCategory = (cat: WasteCategory) => {
    if (acceptedCategories.includes(cat)) {
      setAcceptedCategories(acceptedCategories.filter((c) => c !== cat));
    } else {
      setAcceptedCategories([...acceptedCategories, cat]);
    }
  };

  const toggleService = (svc: ServiceType) => {
    if (services.includes(svc)) {
      setServices(services.filter((s) => s !== svc));
    } else {
      setServices([...services, svc]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganizationProfile({
      name,
      tagline,
      description,
      contact_number: contactNumber,
      email,
      address,
      city,
      operating_hours: operatingHours,
      accepted_categories: acceptedCategories,
      services,
      processing_description: processingDescription,
      pickup_available: services.includes('doorstep_pickup'),
      dropoff_available: services.includes('dropoff'),
      buying_available: services.includes('buying'),
    });

    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Organization Profile & Capabilities
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Configure accepted material categories, certified capabilities, and public processing descriptions for {activeOrg.name}.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-8">
        {savedMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Organization profile saved successfully!</span>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            1. Basic Organization Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tagline / Specialty
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Public Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Dispatch Phone Number
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Depot Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Accepted Waste Categories */}
        <div className="space-y-3 border-t border-stone-200 pt-6">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            2. Accepted Waste Categories
          </h2>
          <p className="text-xs text-stone-500">
            Select all categories your facility is licensed and equipped to accept.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ALL_CATEGORIES.map((cat) => {
              const isChecked = acceptedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-500'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{cat}</span>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services & Capabilities */}
        <div className="space-y-3 border-t border-stone-200 pt-6">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            3. Offered Handover Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_SERVICES.map((svc) => {
              const isChecked = services.includes(svc.type);
              return (
                <button
                  key={svc.type}
                  type="button"
                  onClick={() => toggleService(svc.type)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-500/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-stone-900">{svc.label}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{svc.desc}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center text-[10px] mt-0.5 ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* What Happens to Your Material */}
        <div className="space-y-3 border-t border-stone-200 pt-6">
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              4. "What Happens to Your Material?" Process Narrative
            </h2>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            This narrative appears directly to users when reviewing your organization. Detail your sorting, dismantling, refurbishing, or smelting procedure to guarantee transparency.
          </p>

          <textarea
            value={processingDescription}
            onChange={(e) => setProcessingDescription(e.target.value)}
            rows={4}
            className="w-full text-xs p-3.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium leading-relaxed"
            placeholder="e.g. Collected electronics undergo automated optical sorting, PCB de-soldering, and zero-landfill pyrometallurgical recovery..."
            required
          />
        </div>

        <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={logout}
            className="text-stone-500 hover:text-rose-600 font-semibold text-xs py-2 px-3 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Sign Out of Organization
          </button>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Capabilities</span>
          </button>
        </div>
      </form>
    </div>
  );
};
