import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut,
  X,
  Award,
  Recycle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, logout, requests, feedbacks } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [savedAddresses, setSavedAddresses] = useState<string[]>(
    user.savedAddresses || []
  );
  const [newAddressInput, setNewAddressInput] = useState('');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  if (!isOpen) return null;

  const userRequests = requests.filter((r) => r.user_id === user.id);
  const completedCount = userRequests.filter((r) => r.status === 'Completed').length;
  const reviewsCount = feedbacks.filter((f) => f.user_id === user.id).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      address,
      city,
      savedAddresses,
    });
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
      onClose();
    }, 1200);
  };

  const handleAddAddress = () => {
    if (!newAddressInput.trim()) return;
    setSavedAddresses([...savedAddresses, newAddressInput.trim()]);
    setNewAddressInput('');
  };

  const handleDeleteAddress = (index: number) => {
    setSavedAddresses(savedAddresses.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header - Clean White & Emerald, No Black, No Points/Gamification */}
        <div className="relative bg-white border-b border-stone-200 text-stone-900 p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-xs border border-emerald-500">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Citizen Account</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-2 font-medium">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{user.email}</span>
                <span>•</span>
                <span>{user.city}</span>
              </p>
            </div>
          </div>

          {/* Clean Operational Metrics - NO points or gamification */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-stone-100">
            <div className="bg-stone-50 rounded-xl p-3 text-center border border-stone-200/80">
              <div className="text-xl font-extrabold text-stone-900">
                {userRequests.length}
              </div>
              <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                Total Requests
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 text-center border border-stone-200/80">
              <div className="text-xl font-extrabold text-emerald-700">
                {completedCount}
              </div>
              <div className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                Completed Pickups
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {showSavedMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <div>
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
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
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Primary Home / Pickup Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="border-t border-stone-200 pt-5 space-y-3">
            <label className="block text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Saved Pickup Addresses
            </label>

            <div className="space-y-2">
              {savedAddresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{addr}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newAddressInput}
                onChange={(e) => setNewAddressInput(e.target.value)}
                placeholder="Add other pickup address (e.g. Office, Family home)..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-stone-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Log Out button in profile section */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Log Out</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
