import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, MapPin, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, updateUserProfile, logout } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [savedAddresses, setSavedAddresses] = useState<string[]>(user.savedAddresses || []);
  const [newAddressInput, setNewAddressInput] = useState('');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

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
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const handleAddAddress = () => {
    if (!newAddressInput.trim()) return;
    setSavedAddresses([...savedAddresses, newAddressInput.trim()]);
    setNewAddressInput('');
  };

  const handleDeleteAddress = (index: number) => {
    setSavedAddresses(savedAddresses.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Manage your contact credentials and saved pickup locations.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        {showSavedMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile successfully updated!</span>
          </div>
        )}

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
              Primary Home Address
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

        {/* Saved Addresses */}
        <div className="border-t border-stone-200 pt-6 space-y-3">
          <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
            Saved Pickup Locations
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
                  className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add address input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newAddressInput}
              onChange={(e) => setNewAddressInput(e.target.value)}
              placeholder="Add another pickup address (e.g. Office, Parent's home)..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddAddress}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={logout}
            className="text-stone-500 hover:text-rose-600 font-semibold text-xs py-2 px-3 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Sign Out of Account
          </button>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
