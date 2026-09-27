import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, Organization } from '../../types';
import {
  Building2,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Truck,
  CheckCircle2,
  DollarSign,
  Recycle,
  Search,
  Filter,
  ArrowRight,
  X,
  ExternalLink,
} from 'lucide-react';

const CATEGORY_FILTERS: ('All' | WasteCategory)[] = [
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
];

export const OrganizationsView: React.FC = () => {
  const {
    organizations,
    selectedOrgForDetails,
    setSelectedOrgForDetails,
    setPreselectedOrgForRequest,
    setUserNavTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | WasteCategory>('All');
  const [pickupFilter, setPickupFilter] = useState(false);
  const [buyingFilter, setBuyingFilter] = useState(false);

  // Filter logic
  const filteredOrgs = organizations.filter((org) => {
    // Search
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.city.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Category
    if (selectedCategory !== 'All' && !org.accepted_categories.includes(selectedCategory)) {
      return false;
    }

    // Pickup
    if (pickupFilter && !org.pickup_available) return false;

    // Buying
    if (buyingFilter && !org.buying_available) return false;

    return true;
  });

  const handleStartRequestWithOrg = (org: Organization) => {
    setPreselectedOrgForRequest(org);
    setSelectedOrgForDetails(null);
    setUserNavTab('create_request');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => setUserNavTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Authorized Directory
          </span>
          <span className="text-xs text-stone-500">Publicly verified & demo organizations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Find Collection & Recycling Organizations
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
          Browse certified partner organizations by waste type, pickup capabilities, scrap buying services, and transparent processing procedures.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by organization name, city, or materials..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPickupFilter(!pickupFilter)}
              className={`text-xs font-bold px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                pickupFilter
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doorstep Pickup Only</span>
            </button>

            <button
              onClick={() => setBuyingFilter(!buyingFilter)}
              className={`text-xs font-bold px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                buyingFilter
                  ? 'bg-amber-50 border-amber-500 text-amber-900'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>💰 Buys Scrap</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  {org.isDemo && (
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      Demo Partner
                    </span>
                  )}
                  <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                    {org.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-lg text-xs font-bold border border-amber-200/60 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{org.rating}</span>
                </div>
              </div>

              {org.tagline && (
                <div className="text-xs font-medium text-emerald-800 line-clamp-1">
                  {org.tagline}
                </div>
              )}

              <p className="text-xs text-stone-600 line-clamp-2">
                {org.description}
              </p>

              {/* Accepts */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Accepts:</span>
                <div className="flex flex-wrap gap-1">
                  {org.accepted_categories.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                    >
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                {org.pickup_available && (
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                    🚚 Doorstep Pickup
                  </span>
                )}
                {org.dropoff_available && (
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                    🏢 Drop-off
                  </span>
                )}
                {org.buying_available && (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200/60">
                    💰 Buying
                  </span>
                )}
              </div>

              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{org.address}, {org.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{org.operating_hours}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedOrgForDetails(org)}
                className="text-stone-700 hover:text-stone-900 text-xs font-bold py-1.5 transition-colors cursor-pointer"
              >
                View Details
              </button>
              <button
                onClick={() => handleStartRequestWithOrg(org)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Pickup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Organization Details Modal */}
      {selectedOrgForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Demo Organization Profile
                  </span>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{selectedOrgForDetails.rating}</span>
                    <span className="text-stone-500 font-normal">({selectedOrgForDetails.review_count} reviews)</span>
                  </div>
                </div>
                <h2 className="text-xl font-extrabold text-stone-900">
                  {selectedOrgForDetails.name}
                </h2>
                {selectedOrgForDetails.tagline && (
                  <p className="text-xs text-emerald-800 font-medium">
                    {selectedOrgForDetails.tagline}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedOrgForDetails(null)}
                className="p-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  About Organization
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedOrgForDetails.description}
                </p>
              </div>

              {/* CRITICAL: "What happens to your material?" section */}
              <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Recycle className="w-4 h-4 text-emerald-700" />
                  What happens to your material?
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {selectedOrgForDetails.processing_description}
                </p>
              </div>

              {/* Accepted categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Accepted Materials
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOrgForDetails.accepted_categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200"
                    >
                      ✓ {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capabilities & Services */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <span className="text-stone-500 block mb-0.5">Doorstep Pickup:</span>
                  <span className="font-bold text-stone-800">
                    {selectedOrgForDetails.pickup_available ? '✓ Available' : '✗ Drop-off only'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <span className="text-stone-500 block mb-0.5">Facility Drop-off:</span>
                  <span className="font-bold text-stone-800">
                    {selectedOrgForDetails.dropoff_available ? '✓ Available' : '✗ Pickup only'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <span className="text-stone-500 block mb-0.5">Scrap Buying:</span>
                  <span className="font-bold text-stone-800">
                    {selectedOrgForDetails.buying_available ? '✓ Scrap Payout' : '✗ Non-commercial'}
                  </span>
                </div>
              </div>

              {/* Contact Information & Hours */}
              <div className="space-y-2 text-xs border-t border-stone-200 pt-4">
                <div className="flex items-center gap-2 text-stone-700">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedOrgForDetails.address}, {selectedOrgForDetails.city}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Operating Hours: {selectedOrgForDetails.operating_hours}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedOrgForDetails.contact_number}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedOrgForDetails.email}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedOrgForDetails(null)}
                className="text-stone-600 hover:text-stone-900 text-xs font-bold"
              >
                Close
              </button>

              <button
                onClick={() => handleStartRequestWithOrg(selectedOrgForDetails)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Request Pickup with this Organization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
