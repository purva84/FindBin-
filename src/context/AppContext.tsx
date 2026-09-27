import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organization,
  RequestItem,
  Collector,
  Feedback,
  Complaint,
  UserProfile,
  RequestStatus,
  CollectorAvailability,
  ComplaintStatus,
  AppNotification,
} from '../types';
import {
  INITIAL_USER,
  DEMO_ORGANIZATIONS,
  DEMO_COLLECTORS,
  DEMO_REQUESTS,
  DEMO_FEEDBACKS,
  DEMO_COMPLAINTS,
  DEMO_NOTIFICATIONS,
} from '../data/mockData';

export type UserNavTab =
  | 'dashboard'
  | 'my_requests'
  | 'history'
  | 'create_request'
  | 'organizations';

export type OrgNavTab =
  | 'dashboard'
  | 'pending'
  | 'schedule'
  | 'collectors'
  | 'feedback'
  | 'profile';

interface AppContextType {
  // Authentication & Landing Page
  isAuthenticated: boolean;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
  login: (email: string, role: 'user' | 'organization') => boolean;
  registerUser: (userData: { name: string; email: string; phone: string; address: string; city: string }) => void;
  registerOrganization: (orgData: Partial<Organization> & { name: string; email: string }) => void;
  logout: () => void;

  // Role & View Management
  currentRole: 'user' | 'organization';
  setCurrentRole: (role: 'user' | 'organization') => void;
  userNavTab: UserNavTab;
  setUserNavTab: (tab: UserNavTab) => void;
  orgNavTab: OrgNavTab;
  setOrgNavTab: (tab: OrgNavTab) => void;

  // Profile Drawer / Modal State
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (
    notification: Omit<AppNotification, 'id' | 'timestamp' | 'created_at' | 'read'> & {
      timestamp?: string;
    }
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadNotificationsCount: number;

  // Active Entities
  user: UserProfile;
  activeOrg: Organization;
  setActiveOrgId: (orgId: string) => void;

  // Lists
  organizations: Organization[];
  requests: RequestItem[];
  collectors: Collector[];
  feedbacks: Feedback[];
  complaints: Complaint[];

  // Modals & Navigation Helpers
  selectedRequestForJourney: RequestItem | null;
  setSelectedRequestForJourney: (req: RequestItem | null) => void;
  selectedRequestForFeedback: RequestItem | null;
  setSelectedRequestForFeedback: (req: RequestItem | null) => void;
  selectedRequestForComplaint: RequestItem | null;
  setSelectedRequestForComplaint: (req: RequestItem | null) => void;
  selectedOrgForDetails: Organization | null;
  setSelectedOrgForDetails: (org: Organization | null) => void;
  preselectedOrgForRequest: Organization | null;
  setPreselectedOrgForRequest: (org: Organization | null) => void;

  // Actions
  createRequest: (
    reqData: Omit<RequestItem, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>
  ) => RequestItem;
  updateRequestStatus: (
    requestId: string,
    newStatus: RequestStatus,
    note?: string,
    collectorId?: string
  ) => void;
  acceptRequest: (
    requestId: string,
    confirmedDate: string,
    confirmedTime: string,
    pickupMethod: 'Doorstep Pickup' | 'Drop-off',
    instructions?: string,
    collectorId?: string
  ) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  assignCollector: (requestId: string, collectorId: string) => void;
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  resolveComplaint: (complaintId: string, responseText: string, newStatus: ComplaintStatus) => void;
  updateCollectorAvailability: (collectorId: string, availability: CollectorAvailability) => void;
  addCollector: (name: string, phone: string, vehicle_type?: string) => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  updateOrganizationProfile: (updated: Partial<Organization>) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'findbin_user_v1',
  ORGS: 'findbin_orgs_v1',
  ACTIVE_ORG_ID: 'findbin_active_org_id_v1',
  REQUESTS: 'findbin_requests_v1',
  COLLECTORS: 'findbin_collectors_v1',
  FEEDBACKS: 'findbin_feedbacks_v1',
  COMPLAINTS: 'findbin_complaints_v1',
  ROLE: 'findbin_role_v1',
  AUTH: 'findbin_auth_v1',
  NOTIFICATIONS: 'findbin_notifications_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth & Landing State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === 'true';
  });

  const [showLandingPage, setShowLandingPage] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved !== 'true'; // Show landing page first when not authenticated
  });

  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Role
  const [currentRole, setCurrentRoleState] = useState<'user' | 'organization'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved === 'organization' ? 'organization' : 'user';
  });

  const setCurrentRole = (role: 'user' | 'organization') => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  };

  // Nav Tabs
  const [userNavTab, setUserNavTab] = useState<UserNavTab>('dashboard');
  const [orgNavTab, setOrgNavTab] = useState<OrgNavTab>('dashboard');

  // Modals & Selection
  const [selectedRequestForJourney, setSelectedRequestForJourney] = useState<RequestItem | null>(null);
  const [selectedRequestForFeedback, setSelectedRequestForFeedback] = useState<RequestItem | null>(null);
  const [selectedRequestForComplaint, setSelectedRequestForComplaint] = useState<RequestItem | null>(null);
  const [selectedOrgForDetails, setSelectedOrgForDetails] = useState<Organization | null>(null);
  const [preselectedOrgForRequest, setPreselectedOrgForRequest] = useState<Organization | null>(null);

  // Entities
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORGS);
    return saved ? JSON.parse(saved) : DEMO_ORGANIZATIONS;
  });

  const [activeOrgId, setActiveOrgIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ORG_ID);
    return saved || DEMO_ORGANIZATIONS[0].id;
  });

  const setActiveOrgId = (id: string) => {
    setActiveOrgIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ORG_ID, id);
  };

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  const [requests, setRequests] = useState<RequestItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : DEMO_REQUESTS;
  });

  const [collectors, setCollectors] = useState<Collector[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTORS);
    return saved ? JSON.parse(saved) : DEMO_COLLECTORS;
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    return saved ? JSON.parse(saved) : DEMO_FEEDBACKS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return saved ? JSON.parse(saved) : DEMO_COMPLAINTS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORGS, JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTORS, JSON.stringify(collectors));
  }, [collectors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Notifications Helpers
  const addNotification = (
    notif: Omit<AppNotification, 'id' | 'timestamp' | 'created_at' | 'read'> & {
      timestamp?: string;
    }
  ) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: AppNotification = {
      ...notif,
      id,
      timestamp: notif.timestamp || 'Just now',
      created_at: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.read && n.user_id === user.id
  ).length;

  // Keep selected request in sync with updated list
  useEffect(() => {
    if (selectedRequestForJourney) {
      const updated = requests.find((r) => r.id === selectedRequestForJourney.id);
      if (updated) setSelectedRequestForJourney(updated);
    }
  }, [requests]);

  // Helpers
  const formatTimestamp = (d = new Date()) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Actions
  const createRequest = (
    reqData: Omit<RequestItem, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>
  ): RequestItem => {
    const randomNum = Math.floor(1025 + Math.random() * 8900);
    const newId = `FB${randomNum}`;
    const now = new Date().toISOString();
    const ts = formatTimestamp();

    const newReq: RequestItem = {
      ...reqData,
      id: newId,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      timeline: [{ status: 'Pending', timestamp: ts, note: 'Request submitted to organization' }],
    };

    setRequests((prev) => [newReq, ...prev]);

    // Send confirmation notification
    addNotification({
      user_id: reqData.user_id,
      title: 'Pickup Request Confirmed',
      message: `Pickup request #${newId} for ${reqData.waste_category} has been confirmed and submitted to ${reqData.organization_name}.`,
      type: 'confirmation',
      request_id: newId,
      action_label: 'View Timeline',
    });

    return newReq;
  };

  const updateRequestStatus = (
    requestId: string,
    newStatus: RequestStatus,
    note?: string,
    collectorId?: string
  ) => {
    const ts = formatTimestamp();
    const existingReq = requests.find((r) => r.id === requestId);

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;

        let collectorInfo = {};
        if (collectorId) {
          const col = collectors.find((c) => c.id === collectorId);
          if (col) {
            collectorInfo = {
              collector_id: col.id,
              collector_name: col.name,
              collector_phone: col.phone,
              collector_status: 'Assigned',
            };
          }
        }

        const newTimeline = [...r.timeline, { status: newStatus, timestamp: ts, note }];

        return {
          ...r,
          status: newStatus,
          ...collectorInfo,
          updatedAt: new Date().toISOString(),
          timeline: newTimeline,
        };
      })
    );

    // Notifications on status change
    if (existingReq) {
      if (newStatus === 'Completed') {
        addNotification({
          user_id: existingReq.user_id,
          title: 'Successfully Collected! 🎉',
          message: `Your pickup #${requestId} (${existingReq.waste_category}) was successfully collected! Please take a moment to rate your experience.`,
          type: 'collected',
          request_id: requestId,
          action_label: 'Rate Experience',
        });
      } else if (newStatus === 'Pickup In Progress') {
        addNotification({
          user_id: existingReq.user_id,
          title: 'Collector En Route 🚚',
          message: `The assigned collector is on the way for pickup #${requestId}. Please ensure materials are accessible.`,
          type: 'assigned',
          request_id: requestId,
          action_label: 'Track Pickup',
        });
      }
    }

    // If collector was assigned or completed, update collector load
    if (collectorId && (newStatus === 'Collector Assigned' || newStatus === 'Pickup In Progress')) {
      setCollectors((prev) =>
        prev.map((c) => (c.id === collectorId ? { ...c, active_requests: c.active_requests + 1, availability: 'On Pickup' } : c))
      );
    } else if (newStatus === 'Completed') {
      const req = requests.find((r) => r.id === requestId);
      if (req?.collector_id) {
        setCollectors((prev) =>
          prev.map((c) =>
            c.id === req.collector_id
              ? {
                  ...c,
                  active_requests: Math.max(0, c.active_requests - 1),
                  completed_requests: c.completed_requests + 1,
                  availability: 'Available',
                }
              : c
          )
        );
      }
      if (req?.organization_id) {
        setOrganizations((prev) =>
          prev.map((o) =>
            o.id === req.organization_id
              ? { ...o, completed_requests_count: (o.completed_requests_count || 0) + 1 }
              : o
          )
        );
      }
    }
  };

  const acceptRequest = (
    requestId: string,
    confirmedDate: string,
    confirmedTime: string,
    pickupMethod: 'Doorstep Pickup' | 'Drop-off',
    instructions?: string,
    collectorId?: string
  ) => {
    const ts = formatTimestamp();
    const target = requests.find((r) => r.id === requestId);
    const assignedCollector = collectorId
      ? collectors.find((c) => c.id === collectorId)
      : undefined;

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;

        const timelineEntries = [
          ...r.timeline,
          { status: 'Accepted' as RequestStatus, timestamp: ts, note: 'Accepted by organization' },
          {
            status: 'Scheduled' as RequestStatus,
            timestamp: ts,
            note: `Slot confirmed: ${confirmedDate} (${confirmedTime})`,
          },
        ];

        if (assignedCollector) {
          timelineEntries.push({
            status: 'Collector Assigned' as RequestStatus,
            timestamp: ts,
            note: `Assigned to ${assignedCollector.name} (${assignedCollector.vehicle_type?.split('(')[0].trim() || 'Vehicle'})`,
          });
        }

        return {
          ...r,
          status: (assignedCollector ? 'Collector Assigned' : 'Scheduled') as RequestStatus,
          pickup_date: confirmedDate,
          pickup_time: confirmedTime,
          pickup_method: pickupMethod,
          special_instructions: instructions || r.special_instructions,
          collector_id: assignedCollector?.id || r.collector_id,
          collector_name: assignedCollector?.name || r.collector_name,
          collector_phone: assignedCollector?.phone || r.collector_phone,
          collector_status: assignedCollector ? ('Assigned' as const) : r.collector_status,
          updatedAt: new Date().toISOString(),
          timeline: timelineEntries,
        };
      })
    );

    if (assignedCollector) {
      setCollectors((prev) =>
        prev.map((c) =>
          c.id === assignedCollector.id
            ? {
                ...c,
                active_requests: c.active_requests + 1,
                availability: 'On Pickup',
              }
            : c
        )
      );
    }

    if (target) {
      addNotification({
        user_id: target.user_id,
        title: assignedCollector ? 'Pickup Confirmed & Staff Assigned 🚚' : 'Pickup Slot Confirmed',
        message: assignedCollector
          ? `Your pickup #${requestId} was confirmed for ${confirmedDate} (${confirmedTime}) and assigned to ${assignedCollector.name} (${assignedCollector.phone}).`
          : `Your pickup #${requestId} slot has been confirmed for ${confirmedDate} (${confirmedTime}) by ${target.organization_name}.`,
        type: assignedCollector ? 'assigned' : 'confirmation',
        request_id: requestId,
        action_label: 'View Timeline',
      });
    }
  };

  const rejectRequest = (requestId: string, reason: string) => {
    const ts = formatTimestamp();
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: 'Rejected',
          rejection_reason: reason,
          updatedAt: new Date().toISOString(),
          timeline: [...r.timeline, { status: 'Rejected', timestamp: ts, note: `Rejected: ${reason}` }],
        };
      })
    );
  };

  const assignCollector = (requestId: string, collectorId: string) => {
    const col = collectors.find((c) => c.id === collectorId);
    if (!col) return;
    const ts = formatTimestamp();

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: 'Collector Assigned',
          collector_id: col.id,
          collector_name: col.name,
          collector_phone: col.phone,
          collector_status: 'Assigned',
          updatedAt: new Date().toISOString(),
          timeline: [
            ...r.timeline,
            { status: 'Collector Assigned', timestamp: ts, note: `Assigned to ${col.name} (${col.phone})` },
          ],
        };
      })
    );

    setCollectors((prev) =>
      prev.map((c) => (c.id === collectorId ? { ...c, active_requests: c.active_requests + 1 } : c))
    );
  };

  const submitFeedback = (fbData: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFb: Feedback = {
      ...fbData,
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFb, ...prev]);

    // Recalculate org rating
    const orgFeedbacks = [...feedbacks.filter((f) => f.organization_id === fbData.organization_id), newFb];
    const avgRating = Number(
      (orgFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / orgFeedbacks.length).toFixed(1)
    );

    setOrganizations((prev) =>
      prev.map((o) =>
        o.id === fbData.organization_id
          ? { ...o, rating: avgRating, review_count: orgFeedbacks.length }
          : o
      )
    );

    // Send feedback confirmation notification
    addNotification({
      user_id: fbData.user_id,
      title: 'Feedback Submitted ⭐',
      message: `Thank you for rating your pickup! Your feedback supports certified recycling and responsible collectors.`,
      type: 'feedback',
      request_id: fbData.request_id,
    });
  };

  const submitComplaint = (cData: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComp: Complaint = {
      ...cData,
      id: `C${Math.floor(103 + Math.random() * 900)}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComp, ...prev]);
  };

  const resolveComplaint = (complaintId: string, responseText: string, newStatus: ComplaintStatus) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              response: responseText,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const updateCollectorAvailability = (collectorId: string, availability: CollectorAvailability) => {
    setCollectors((prev) =>
      prev.map((c) => (c.id === collectorId ? { ...c, availability } : c))
    );
  };

  const addCollector = (name: string, phone: string, vehicle_type?: string) => {
    const newCol: Collector = {
      id: `col_${Date.now()}`,
      organization_id: activeOrg.id,
      name,
      phone,
      availability: 'Available',
      active_requests: 0,
      completed_requests: 0,
      vehicle_type: vehicle_type || 'Cargo Vehicle',
    };
    setCollectors((prev) => [...prev, newCol]);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const updateOrganizationProfile = (updated: Partial<Organization>) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === activeOrg.id ? { ...o, ...updated } : o))
    );
  };

  const login = (email: string, role: 'user' | 'organization'): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    if (role === 'user') {
      setCurrentRole('user');
      setUserNavTab('dashboard');
      if (user.email.toLowerCase() !== trimmedEmail) {
        setUser((prev) => ({ ...prev, email: trimmedEmail }));
      }
    } else {
      setCurrentRole('organization');
      setOrgNavTab('dashboard');
      const foundOrg = organizations.find((o) => o.email.toLowerCase() === trimmedEmail);
      if (foundOrg) {
        setActiveOrgId(foundOrg.id);
      }
    }
    setIsAuthenticated(true);
    setShowLandingPage(false);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    return true;
  };

  const registerUser = (userData: { name: string; email: string; phone: string; address: string; city: string }) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      role: 'user',
      savedAddresses: [userData.address],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setCurrentRole('user');
    setUserNavTab('dashboard');
    setIsAuthenticated(true);
    setShowLandingPage(false);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  };

  const registerOrganization = (orgData: Partial<Organization> & { name: string; email: string }) => {
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: orgData.name,
      tagline: orgData.tagline || 'Certified Material Recovery Facility',
      description: orgData.description || 'Collection depot and resource recovery processing unit.',
      email: orgData.email,
      contact_number: orgData.contact_number || '+91 20 2800 0000',
      address: orgData.address || 'Industrial Area, Pune',
      city: orgData.city || 'Pune',
      operating_hours: orgData.operating_hours || '9:00 AM – 6:00 PM (Mon - Sat)',
      accepted_categories: orgData.accepted_categories && orgData.accepted_categories.length > 0 ? orgData.accepted_categories : ['E-Waste', 'Plastic'],
      services: orgData.services || ['doorstep_pickup', 'dropoff', 'recycling'],
      pickup_available: orgData.pickup_available ?? true,
      dropoff_available: orgData.dropoff_available ?? true,
      buying_available: orgData.buying_available ?? true,
      rating: 5.0,
      review_count: 1,
      completed_requests_count: 0,
      processing_description: orgData.processing_description || 'Materials are segregated and transferred to certified circular partners.',
      isDemo: false,
    };
    setOrganizations((prev) => [newOrg, ...prev]);
    setActiveOrgId(newOrg.id);
    setCurrentRole('organization');
    setOrgNavTab('dashboard');
    setIsAuthenticated(true);
    setShowLandingPage(false);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setShowLandingPage(true);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const resetDemoData = () => {
    setUser(INITIAL_USER);
    setOrganizations(DEMO_ORGANIZATIONS);
    setRequests(DEMO_REQUESTS);
    setCollectors(DEMO_COLLECTORS);
    setFeedbacks(DEMO_FEEDBACKS);
    setComplaints(DEMO_COMPLAINTS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        showLandingPage,
        setShowLandingPage,
        login,
        registerUser,
        registerOrganization,
        logout,
        currentRole,
        setCurrentRole,
        userNavTab,
        setUserNavTab,
        orgNavTab,
        setOrgNavTab,
        isProfileOpen,
        setIsProfileOpen,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        unreadNotificationsCount,
        user,
        activeOrg,
        setActiveOrgId,
        organizations,
        requests,
        collectors,
        feedbacks,
        complaints,
        selectedRequestForJourney,
        setSelectedRequestForJourney,
        selectedRequestForFeedback,
        setSelectedRequestForFeedback,
        selectedRequestForComplaint,
        setSelectedRequestForComplaint,
        selectedOrgForDetails,
        setSelectedOrgForDetails,
        preselectedOrgForRequest,
        setPreselectedOrgForRequest,
        createRequest,
        updateRequestStatus,
        acceptRequest,
        rejectRequest,
        assignCollector,
        submitFeedback,
        submitComplaint,
        resolveComplaint,
        updateCollectorAvailability,
        addCollector,
        updateUserProfile,
        updateOrganizationProfile,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
