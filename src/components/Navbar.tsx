import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationDropdown } from './common/NotificationDropdown';
import { ProfileModal } from './common/ProfileModal';
import {
  Recycle,
  User,
  Building2,
  Menu,
  X,
  LogOut,
  Info,
  ChevronDown,
  Bell,
  LayoutDashboard,
  PackageCheck,
  History,
  Calendar,
  Users,
  Star,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const {
    currentRole,
    setCurrentRole,
    user,
    activeOrg,
    organizations,
    setActiveOrgId,
    requests,
    userNavTab,
    setUserNavTab,
    orgNavTab,
    setOrgNavTab,
    setShowLandingPage,
    unreadNotificationsCount,
    isProfileOpen,
    setIsProfileOpen,
    logout,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userActiveCount = requests.filter(
    (r) =>
      r.user_id === user.id &&
      r.status !== 'Completed' &&
      r.status !== 'Cancelled' &&
      r.status !== 'Rejected'
  ).length;

  const userCompletedCount = requests.filter(
    (r) => r.user_id === user.id && r.status === 'Completed'
  ).length;

  const orgPendingCount = requests.filter(
    (r) =>
      r.organization_id === activeOrg.id &&
      (r.status === 'Pending' || r.status === 'Accepted')
  ).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={() => {
                  if (currentRole === 'user') setUserNavTab('dashboard');
                  else setOrgNavTab('dashboard');
                }}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-extrabold text-lg text-stone-900 tracking-tight leading-none">
                    FindBin <span className="text-emerald-600">♻️</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-semibold tracking-tight hidden sm:block">
                    Circular Recovery
                  </div>
                </div>
              </button>
            </div>

            {/* Center: Navigation tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
              {currentRole === 'user' ? (
                <>
                  <button
                    onClick={() => setUserNavTab('dashboard')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userNavTab === 'dashboard'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => setUserNavTab('organizations')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userNavTab === 'organizations'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Organizations</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setOrgNavTab('dashboard')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orgNavTab === 'dashboard'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => setOrgNavTab('pending')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orgNavTab === 'pending'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <span>Pending</span>
                    {orgPendingCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 text-[10px] flex items-center justify-center font-black">
                        {orgPendingCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setOrgNavTab('collectors')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orgNavTab === 'collectors'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Collectors</span>
                  </button>

                  <button
                    onClick={() => setOrgNavTab('feedback')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orgNavTab === 'feedback'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Customer Feedback</span>
                  </button>
                </>
              )}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Toggle */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  onClick={() => setCurrentRole('user')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentRole === 'user'
                      ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/60'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <User className="w-3 h-3 text-emerald-600" />
                  <span className="hidden sm:inline">User</span>
                </button>

                <button
                  onClick={() => setCurrentRole('organization')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentRole === 'organization'
                      ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/60'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Building2 className="w-3 h-3 text-emerald-600" />
                  <span className="hidden sm:inline">Org</span>
                </button>
              </div>

              {/* Notification Bell Icon */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
                    notificationsOpen
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  }`}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>

              {/* Profile Section (Click to open Profile Modal with Log Out button) */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 hover:border-emerald-400 bg-stone-50 hover:bg-emerald-50/50 transition-all cursor-pointer group text-left"
                title="Open Profile & Settings"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {currentRole === 'user'
                    ? user.name ? user.name.charAt(0).toUpperCase() : 'U'
                    : '🏢'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-black text-stone-900 leading-tight group-hover:text-emerald-800 transition-colors truncate max-w-[110px]">
                    {currentRole === 'user' ? user.name : activeOrg.name}
                  </div>
                  <div className="text-[10px] text-stone-500 font-semibold leading-none mt-0.5">
                    {currentRole === 'user' ? 'View Profile' : 'Org Profile'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 transition-colors hidden sm:block" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white p-4 space-y-3 animate-fadeIn">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Navigation
            </div>
            {currentRole === 'user' ? (
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setUserNavTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                    userNavTab === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                    <span>Dashboard</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserNavTab('organizations');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold ${
                    userNavTab === 'organizations'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Organizations</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setOrgNavTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setOrgNavTab('pending');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  <span>Pending Requests</span>
                  {orgPendingCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] flex items-center justify-center font-bold">
                      {orgPendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setOrgNavTab('collectors');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Collectors</span>
                </button>
                <button
                  onClick={() => {
                    setOrgNavTab('feedback');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Customer Feedback</span>
                </button>
              </div>
            )}

            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsProfileOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Profile & Settings
              </button>
              <button
                onClick={logout}
                className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};
