import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/common/LandingPage';
import { AuthModal } from './components/common/AuthModal';

import { UserDashboard } from './components/user/UserDashboard';
import { CreateRequestView } from './components/user/CreateRequestView';
import { OrganizationsView } from './components/user/OrganizationsView';
import { MyRequestsView } from './components/user/MyRequestsView';
import { HistoryView } from './components/user/HistoryView';
import { RequestJourneyModal } from './components/user/RequestJourneyModal';
import { FeedbackModal } from './components/user/FeedbackModal';
import { ComplaintModal } from './components/user/ComplaintModal';

import { OrgDashboard } from './components/org/OrgDashboard';
import { OrgPendingRequests } from './components/org/OrgPendingRequests';
import { OrgSchedule } from './components/org/OrgSchedule';
import { OrgCollectors } from './components/org/OrgCollectors';
import { OrgFeedback } from './components/org/OrgFeedback';
import { OrgProfile } from './components/org/OrgProfile';

const AppContent: React.FC = () => {
  const {
    currentRole,
    userNavTab,
    setUserNavTab,
    orgNavTab,
    selectedRequestForJourney,
    setSelectedRequestForJourney,
    selectedRequestForFeedback,
    setSelectedRequestForFeedback,
    selectedRequestForComplaint,
    setSelectedRequestForComplaint,
    showLandingPage,
    setShowLandingPage,
    isAuthenticated,
  } = useApp();

  const [authModal, setAuthModal] = useState<{
    open: boolean;
    mode: 'login' | 'signup';
    role: 'user' | 'organization';
  }>({
    open: false,
    mode: 'login',
    role: 'user',
  });

  // If user is not authenticated or clicked "About FindBin / Home", show Landing Page
  if (showLandingPage && !isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode, role) => setAuthModal({ open: true, mode, role })}
          onExploreDirectory={() => {
            setShowLandingPage(false);
            setUserNavTab('organizations');
          }}
        />
        <AuthModal
          isOpen={authModal.open}
          onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))}
          initialMode={authModal.mode}
          initialRole={authModal.role}
        />
      </>
    );
  }

  // If user is authenticated but clicked to view Landing Page info
  if (showLandingPage && isAuthenticated) {
    return (
      <div className="relative">
        {/* Banner to return to dashboard */}
        <div className="sticky top-0 z-50 bg-stone-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>You are viewing the FindBin overview while logged in as <strong>{currentRole === 'user' ? 'Individual User' : 'Collection Organization'}</strong>.</span>
          </div>
          <button
            onClick={() => setShowLandingPage(false)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Return to Dashboard →
          </button>
        </div>

        <LandingPage
          onOpenAuth={(mode, role) => setAuthModal({ open: true, mode, role })}
          onExploreDirectory={() => {
            setShowLandingPage(false);
            setUserNavTab('organizations');
          }}
        />
        <AuthModal
          isOpen={authModal.open}
          onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))}
          initialMode={authModal.mode}
          initialRole={authModal.role}
        />
      </div>
    );
  }

  // Render current active tab based on active role
  const renderMainContent = () => {
    if (currentRole === 'user') {
      switch (userNavTab) {
        case 'dashboard':
          return <UserDashboard />;
        case 'my_requests':
          return <MyRequestsView />;
        case 'history':
          return <HistoryView />;
        case 'create_request':
          return <CreateRequestView />;
        case 'organizations':
          return <OrganizationsView />;
        default:
          return <UserDashboard />;
      }
    } else {
      switch (orgNavTab) {
        case 'dashboard':
          return <OrgDashboard />;
        case 'schedule':
          return <OrgSchedule />;
        case 'pending':
          return <OrgPendingRequests />;
        case 'collectors':
          return <OrgCollectors />;
        case 'feedback':
          return <OrgFeedback />;
        case 'profile':
          return <OrgProfile />;
        default:
          return <OrgDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area - No left sidebar */}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        <div className="flex-1 p-3 sm:p-6 pb-16 max-w-7xl w-full mx-auto">
          {renderMainContent()}
        </div>
      </main>

      {/* Global Interactive Modals */}
      <RequestJourneyModal
        request={selectedRequestForJourney}
        onClose={() => setSelectedRequestForJourney(null)}
        onOpenFeedback={(req) => {
          setSelectedRequestForJourney(null);
          setSelectedRequestForFeedback(req);
        }}
        onOpenComplaint={(req) => {
          setSelectedRequestForJourney(null);
          setSelectedRequestForComplaint(req);
        }}
      />

      <FeedbackModal
        request={selectedRequestForFeedback}
        onClose={() => setSelectedRequestForFeedback(null)}
      />

      <ComplaintModal
        request={selectedRequestForComplaint}
        onClose={() => setSelectedRequestForComplaint(null)}
      />

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))}
        initialMode={authModal.mode}
        initialRole={authModal.role}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
