export type UserRole = 'admin' | 'coach' | 'school_admin' | 'society_manager' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at?: string;
}

export interface CoachProfile {
  id: number;
  user_id?: number;
  full_name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  pincode: string;
  service_area: string;
  sports_specialisations: string; // JSON array string
  qualifications: string;
  experience_years: number;
  age_groups_served: string;
  online_available: number;
  home_visit_available: number;
  preferred_hours?: string;
  photo_url?: string;
  id_document_url?: string;
  certificates_url?: string;
  verification_status: 'Application Received' | 'Documents Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Suspended';
  monthly_earnings: number;
  rating: number;
  bio?: string;
}

export interface SchoolEnquiry {
  id: number;
  school_name: string;
  school_board: string;
  school_address: string;
  state: string;
  city: string;
  pincode: string;
  principal_name: string;
  contact_name: string;
  phone: string;
  email: string;
  total_students: number;
  num_classes: number;
  existing_pti_staff?: string;
  sports_facilities?: string;
  sports_offered?: string;
  sports_wanted?: string;
  available_equipment?: string;
  preferred_meeting_date?: string;
  additional_requirements?: string;
  proposed_coach_count: number;
  meets_min_requirement: number;
  proposed_price_monthly: number;
  contract_value_annual: number;
  status: 'Enquiry Received' | 'Under Review' | 'Proposal Sent' | 'Demo Scheduled' | 'Contract Signed' | 'Active' | 'Rejected';
  curriculum_config?: string;
  created_at: string;
}

export interface ResidentialSociety {
  id: number;
  society_name: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  contact_name: string;
  phone: string;
  email: string;
  selected_programme: string;
  child_count: number;
  age_range: string;
  session_duration: '1-hour' | '2-hour' | 'Custom';
  sessions_per_week: number;
  fee_per_child: number;
  gross_monthly_fee: number;
  status: 'Enquiry Received' | 'Under Review' | 'Minimum Enrolment Pending' | 'Proposal Sent' | 'Approved' | 'Ready to Start' | 'Active' | 'Completed' | 'Cancelled';
  assigned_coach_id?: number;
  coach_name?: string;
  coach_phone?: string;
  equipment_included?: string;
  created_at: string;
}

export interface PersonalTrainingCategory {
  id: number;
  name: string;
  description: string;
  age_groups: string;
  training_modes: string; // JSON array
  duration_minutes: number;
  monthly_price: number;
  coach_share: number;
  company_share: number;
  is_active: number;
}

export interface Booking {
  id: number;
  booking_code: string;
  customer_id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_type: string;
  category_name: string;
  training_mode: string;
  address?: string;
  city: string;
  pincode: string;
  preferred_slot?: string;
  session_date?: string;
  monthly_price: number;
  coach_id?: number;
  coach_name?: string;
  video_meeting_link?: string;
  status: 'Draft' | 'Booking Requested' | 'Awaiting Payment' | 'Payment Pending Verification' | 'Confirmed' | 'Coach Assigned' | 'Session Scheduled' | 'In Progress' | 'Completed' | 'Cancellation Requested' | 'Cancelled' | 'Refund Pending' | 'Refunded';
  payment_status: 'pending' | 'paid' | 'verified' | 'failed' | 'refunded';
  payment_method: string;
  utr_transaction_ref?: string;
  notes?: string;
  created_at: string;
}

export interface FinancialSummary {
  totalGrossCollections: number;
  totalCoachPayouts: number;
  totalCompanyGross: number;
  totalOperatingExpenses: number;
  totalNetProfit: number;
}

export interface FinancialTransaction {
  id: number;
  date: string;
  vertical: 'School Sports' | 'Residential Society' | 'Personal Training';
  reference_id: string;
  client_name: string;
  gross_amount: number;
  coach_payout: number;
  company_gross: number;
  operating_expenses: number;
  net_result: number;
  payment_mode: string;
  payout_status: 'Recorded' | 'Pending Payout' | 'Paid Out' | 'Refunded';
}

export interface QRCodeItem {
  id: number;
  title: string;
  campaign_type: string;
  destination_url: string;
  qr_svg_data?: string;
  uploaded_image_url?: string;
  is_official_payment: number;
  is_active: number;
  scan_count: number;
  notes?: string;
}

export interface EquipmentItem {
  id: number;
  item_name: string;
  category: string;
  total_quantity: number;
  available_quantity: number;
  society_name?: string;
  coach_name?: string;
  condition: 'Good' | 'Fair' | 'Damaged' | 'Needs Maintenance';
  cost_per_item: number;
  included_in_fee: number;
  last_inspected?: string;
}

export interface NotificationItem {
  id: number;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'coach_verification' | 'enquiry' | 'payout';
  is_read: number;
  created_at: string;
}
