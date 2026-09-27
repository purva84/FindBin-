export type WasteCategory =
  | 'Wet / Organic Waste'
  | 'Plastic'
  | 'Paper & Cardboard'
  | 'Glass'
  | 'Metal'
  | 'Textile'
  | 'E-Waste'
  | 'Battery / Hazardous'
  | 'Mixed Waste'
  | 'Other';

export type UserIntent = 'sell' | 'dispose';

export type ServiceType =
  | 'doorstep_pickup'
  | 'dropoff'
  | 'buying'
  | 'repair'
  | 'donation'
  | 'recycling'
  | 'specialized_handling';

export type RequestStatus =
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Scheduled'
  | 'Collector Assigned'
  | 'Pickup In Progress'
  | 'Picked Up'
  | 'Completed'
  | 'Cancelled';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  role: 'user' | 'organization';
  savedAddresses: string[];
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  accepted_categories: WasteCategory[];
  services: ServiceType[];
  address: string;
  city: string;
  contact_number: string;
  email: string;
  website?: string;
  operating_hours: string;
  pickup_available: boolean;
  dropoff_available: boolean;
  buying_available: boolean;
  rating: number;
  review_count: number;
  completed_requests_count: number;
  processing_description: string; // "What happens to your material?"
  isDemo: boolean;
}

export interface TimelineEntry {
  status: RequestStatus;
  timestamp: string;
  note?: string;
}

export interface RequestItem {
  id: string; // e.g. FB1024
  user_id: string;
  user_name: string;
  user_phone: string;
  organization_id: string;
  organization_name: string;
  waste_category: WasteCategory;
  description: string;
  quantity: string;
  intent: UserIntent;
  image_url?: string;
  pickup_method: 'Doorstep Pickup' | 'Drop-off';
  pickup_address: string;
  pickup_date: string;
  pickup_time: string;
  status: RequestStatus;
  collector_id?: string;
  collector_name?: string;
  collector_phone?: string;
  collector_status?: string;
  rejection_reason?: string;
  special_instructions?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

export type CollectorAvailability = 'Available' | 'On Pickup' | 'Unavailable';

export interface Collector {
  id: string;
  organization_id: string;
  name: string;
  phone: string;
  availability: CollectorAvailability;
  active_requests: number;
  completed_requests: number;
  vehicle_type?: string;
}

export interface Feedback {
  id: string;
  request_id: string;
  user_id: string;
  user_name: string;
  organization_id: string;
  rating: number; // 1-5
  pickup_rating?: number;
  communication_rating?: number;
  comment: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'Collector did not arrive'
  | 'Pickup delayed'
  | 'Wrong information'
  | 'Poor communication'
  | 'Other';

export type ComplaintStatus = 'Open' | 'Investigating' | 'Resolved';

export interface Complaint {
  id: string;
  request_id: string;
  user_id: string;
  user_name: string;
  organization_id: string;
  organization_name: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  response?: string;
  createdAt: string;
  updatedAt?: string;
}


export type NotificationType =
  | 'confirmation'
  | 'collected'
  | 'assigned'
  | 'feedback'
  | 'status_update'
  | 'info';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  created_at: string;
  read: boolean;
  request_id?: string;
  action_label?: string;
}
