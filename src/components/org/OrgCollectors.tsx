import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Collector, CollectorAvailability } from '../../types';
import { Users, Phone, Truck, Plus, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const OrgCollectors: React.FC = () => {
  const { collectors, updateCollectorAvailability, addCollector, activeOrg } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [vehicle, setVehicle] = useState('Electric Cargo Van (MH-12)');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCollector(name.trim(), phone.trim(), vehicle.trim());
    setName('');
    setPhone('+91 ');
    setAddModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Collector & Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Monitor field personnel readiness, vehicle assignments, and real-time pickup status.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collector</span>
        </button>
      </div>

      {/* Collectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collectors.map((c) => {
          const isAvail = c.availability === 'Available';
          const isOnPickup = c.availability === 'On Pickup';

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-700 font-extrabold flex items-center justify-center text-sm border border-stone-200">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm">{c.name}</h3>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{c.phone}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isAvail
                        ? 'bg-emerald-100 text-emerald-800'
                        : isOnPickup
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isAvail ? '🟢 Available' : isOnPickup ? '🟡 On Pickup' : '🔴 Unavailable'}
                  </span>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium truncate">{c.vehicle_type || 'Eco Cargo Vehicle'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Active Pickups</span>
                    <span className="font-extrabold text-stone-800 text-sm">{c.active_requests}</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Completed</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{c.completed_requests}</span>
                  </div>
                </div>
              </div>

              {/* Status Toggle buttons */}
              <div className="pt-3 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1.5">
                  Update Availability:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {(['Available', 'On Pickup', 'Unavailable'] as CollectorAvailability[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateCollectorAvailability(c.id, st)}
                      className={`text-[10px] font-bold py-1.5 rounded-lg border transition-all cursor-pointer ${
                        c.availability === st
                          ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {st === 'Available' ? 'Available' : st === 'On Pickup' ? 'On Pickup' : 'Off Duty'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD COLLECTOR MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-fadeIn">
            <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">Add Collector Personnel</h3>
                <p className="text-xs text-stone-500">Register new field driver / pickup staff</p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Shinde"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98230 00000"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Assigned Vehicle / Equipment
                </label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. Electric Three Wheeler Cargo (MH-12-AB-1234)"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
