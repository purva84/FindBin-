import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Recycle,
  User,
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { WasteCategory } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  initialRole: 'user' | 'organization';
}

const SAMPLE_USERS = [
  { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', role: 'user', desc: 'Household resident in Pune' },
  { name: 'Priya Verma', email: 'priya.verma@example.com', role: 'user', desc: 'Active plastic & dry waste recycler' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  initialRole,
}) => {
  const {
    login,
    registerUser,
    registerOrganization,
    organizations,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'user' | 'organization'>(initialRole);

  // Form Fields
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Pune');
  const [tagline, setTagline] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<WasteCategory[]>(['E-Waste']);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide email and password.');
      return;
    }

    if (mode === 'login') {
      const success = login(email.trim(), role);
      if (success) {
        onClose();
      } else {
        setError('No account found matching this email for selected role.');
      }
    } else {
      // Sign up
      if (!name.trim()) {
        setError('Please enter your full name or organization title.');
        return;
      }

      if (role === 'user') {
        registerUser({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || '+91 98000 00000',
          address: address.trim() || 'Pune City',
          city: city.trim() || 'Pune',
        });
      } else {
        registerOrganization({
          name: name.trim(),
          tagline: tagline.trim() || 'Authorized Material Recovery Facility',
          description: 'Specialized collection depot and processing facility.',
          email: email.trim(),
          contact_number: phone.trim() || '+91 20 2800 0000',
          address: address.trim() || 'Industrial Estate, Pune',
          city: city.trim() || 'Pune',
          operating_hours: '9:00 AM – 6:00 PM (Mon - Sat)',
          accepted_categories: selectedCategories.length > 0 ? selectedCategories : ['E-Waste'],
          services: ['doorstep_pickup', 'dropoff', 'recycling'],
          pickup_available: true,
          dropoff_available: true,
          buying_available: true,
          processing_description: 'Materials are safely received, segregated, and redirected to verified circular re-manufacturers.',
        });
      }

      onClose();
    }
  };

  const handleSelectDemoAccount = (accEmail: string, accRole: 'user' | 'organization') => {
    setEmail(accEmail);
    setRole(accRole);
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900">
                {mode === 'login' ? 'Welcome Back to FindBin' : 'Create your FindBin Account'}
              </h2>
              <p className="text-xs text-stone-500">
                {role === 'user' ? 'Household & User Portal' : 'Recovery & Organization Portal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Role Switcher */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('user');
                  if (mode === 'login') setEmail('rahul.sharma@example.com');
                }}
                className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'user'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-2xs ring-1 ring-emerald-500/20'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Individual User</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('organization');
                  if (mode === 'login') setEmail(organizations[0]?.email || 'contact@abcecorecycling.in');
                }}
                className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'organization'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-2xs ring-1 ring-emerald-500/20'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Collection Organization</span>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Demo Accounts */}
          {mode === 'login' && (
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase">
                <span>Quick Fill Demo Accounts:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role === 'user' ? (
                  SAMPLE_USERS.map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => handleSelectDemoAccount(u.email, 'user')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        email === u.email
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {u.name}
                    </button>
                  ))
                ) : (
                  organizations.slice(0, 3).map((org) => (
                    <button
                      key={org.email}
                      type="button"
                      onClick={() => handleSelectDemoAccount(org.email, 'organization')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        email === org.email
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {org.name.split(' ')[0]}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actual Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {role === 'user' ? 'Full Name' : 'Organization Name'} <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'user' ? 'e.g. Siddharth Joshi' : 'e.g. CleanEarth Recovery Ltd'}
                    required
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {role === 'organization' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Organization Tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Industrial Polymer & Scrap Plastic Upcyclers"
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address <span className="text-emerald-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                required
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Password <span className="text-emerald-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-xs p-3 pr-10 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {role === 'user' ? 'Pickup Address' : 'Facility Location'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, area, building or industrial sector..."
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{mode === 'login' ? `Sign In as ${role === 'user' ? 'User' : 'Organization'}` : `Create ${role === 'user' ? 'User' : 'Organization'} Account`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="pt-2 text-center text-xs text-stone-500">
            {mode === 'login' ? (
              <div>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            ) : (
              <div>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
