const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/parametric_play.db');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'coach', 'school_admin', 'society_manager', 'customer')),
    password TEXT NOT NULL DEFAULT 'password123',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coach_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    service_area TEXT NOT NULL,
    sports_specialisations TEXT NOT NULL, -- JSON array
    qualifications TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    age_groups_served TEXT NOT NULL,
    online_available INTEGER DEFAULT 1,
    home_visit_available INTEGER DEFAULT 1,
    preferred_hours TEXT DEFAULT '6:00 AM - 10:00 AM, 4:00 PM - 8:00 PM',
    photo_url TEXT,
    id_document_url TEXT,
    certificates_url TEXT,
    verification_status TEXT DEFAULT 'Under Review' CHECK(verification_status IN ('Application Received', 'Documents Pending', 'Under Review', 'Verified', 'Rejected', 'Suspended')),
    monthly_earnings REAL DEFAULT 0,
    rating REAL DEFAULT 4.9,
    bio TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS school_enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_name TEXT NOT NULL,
    school_board TEXT NOT NULL,
    school_address TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    principal_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    total_students INTEGER NOT NULL,
    num_classes INTEGER NOT NULL,
    existing_pti_staff TEXT,
    sports_facilities TEXT,
    sports_offered TEXT,
    sports_wanted TEXT,
    available_equipment TEXT,
    preferred_meeting_date TEXT,
    additional_requirements TEXT,
    proposed_coach_count INTEGER NOT NULL,
    meets_min_requirement INTEGER NOT NULL, -- 1 if total_students >= 800
    proposed_price_monthly REAL DEFAULT 45000,
    contract_value_annual REAL DEFAULT 540000,
    status TEXT DEFAULT 'Enquiry Received' CHECK(status IN ('Enquiry Received', 'Under Review', 'Proposal Sent', 'Demo Scheduled', 'Contract Signed', 'Active', 'Rejected')),
    curriculum_config TEXT, -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS residential_societies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    society_name TEXT NOT NULL,
    address TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    selected_programme TEXT NOT NULL,
    child_count INTEGER NOT NULL,
    age_range TEXT NOT NULL,
    session_duration TEXT DEFAULT '1-hour' CHECK(session_duration IN ('1-hour', '2-hour', 'Custom')),
    sessions_per_week INTEGER DEFAULT 3,
    fee_per_child REAL DEFAULT 2000,
    gross_monthly_fee REAL NOT NULL,
    status TEXT DEFAULT 'Enquiry Received' CHECK(status IN ('Enquiry Received', 'Under Review', 'Minimum Enrolment Pending', 'Proposal Sent', 'Approved', 'Ready to Start', 'Active', 'Completed', 'Cancelled')),
    assigned_coach_id INTEGER,
    equipment_included TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(assigned_coach_id) REFERENCES coach_profiles(id)
  );

  CREATE TABLE IF NOT EXISTS personal_training_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    age_groups TEXT NOT NULL,
    training_modes TEXT NOT NULL, -- JSON
    duration_minutes INTEGER DEFAULT 60,
    monthly_price REAL DEFAULT 2000,
    coach_share REAL DEFAULT 1000,
    company_share REAL DEFAULT 1000,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,
    customer_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    service_type TEXT NOT NULL, -- 'Personal Training Home', 'Personal Training Online', 'Society Enrolment'
    category_name TEXT NOT NULL,
    training_mode TEXT NOT NULL, -- 'Home Visit', 'Online', 'In-Person'
    address TEXT,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    preferred_slot TEXT NOT NULL,
    session_date TEXT,
    monthly_price REAL DEFAULT 2000,
    coach_id INTEGER,
    coach_name TEXT,
    video_meeting_link TEXT,
    status TEXT DEFAULT 'Booking Requested' CHECK(status IN ('Draft', 'Booking Requested', 'Awaiting Payment', 'Payment Pending Verification', 'Confirmed', 'Coach Assigned', 'Session Scheduled', 'In Progress', 'Completed', 'Cancellation Requested', 'Cancelled', 'Refund Pending', 'Refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'verified', 'failed', 'refunded')),
    payment_method TEXT DEFAULT 'UPI QR',
    utr_transaction_ref TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(coach_id) REFERENCES coach_profiles(id)
  );

  CREATE TABLE IF NOT EXISTS equipment_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    total_quantity INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL,
    assigned_to_society_id INTEGER,
    assigned_to_coach_id INTEGER,
    condition TEXT DEFAULT 'Good' CHECK(condition IN ('Good', 'Fair', 'Damaged', 'Needs Maintenance')),
    cost_per_item REAL DEFAULT 500,
    included_in_fee INTEGER DEFAULT 1,
    last_inspected TEXT,
    FOREIGN KEY(assigned_to_society_id) REFERENCES residential_societies(id),
    FOREIGN KEY(assigned_to_coach_id) REFERENCES coach_profiles(id)
  );

  CREATE TABLE IF NOT EXISTS qr_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    destination_url TEXT NOT NULL,
    qr_svg_data TEXT,
    uploaded_image_url TEXT,
    is_official_payment INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    scan_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS financial_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    vertical TEXT NOT NULL CHECK(vertical IN ('School Sports', 'Residential Society', 'Personal Training')),
    reference_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    gross_amount REAL NOT NULL,
    coach_payout REAL NOT NULL,
    company_gross REAL NOT NULL,
    operating_expenses REAL DEFAULT 0,
    net_result REAL NOT NULL,
    payment_mode TEXT DEFAULT 'UPI',
    payout_status TEXT DEFAULT 'Recorded' CHECK(payout_status IN ('Recorded', 'Pending Payout', 'Paid Out', 'Refunded')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS city_coverage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode_prefix TEXT NOT NULL,
    coach_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Coming Soon', 'Waitlist Open'))
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL, -- user ID or 'admin' or 'all'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'booking', 'payment', 'coach_verification', 'enquiry', 'payout'
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default settings if empty
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM system_settings').get().count;
if (settingsCount === 0) {
  const insertSetting = db.prepare('INSERT INTO system_settings (key, value, description) VALUES (?, ?, ?)');
  const defaultSettings = [
    ['company_name', 'Parametric Play', 'Company Legal Name'],
    ['company_tagline', 'Professional Sports Coaching. One Platform. Three Solutions.', 'Official Brand Tagline'],
    ['contact_phone', '8102140650', 'Primary Phone / WhatsApp'],
    ['contact_email', 'playparametric@gmail.com', 'Primary Contact Email'],
    ['school_min_students', '800', 'Minimum student count requirement for school partnership'],
    ['school_coach_ratio', '400', 'Coach staffing ratio: 1 Coach per 400 students'],
    ['society_min_children', '10', 'Minimum registered children per society batch'],
    ['society_monthly_fee_per_child', '2000', 'Standard monthly fee per child in INR'],
    ['pt_monthly_price', '2000', 'Standard personal training package price in INR'],
    ['pt_coach_share', '1000', 'Coach monthly allocation per client in INR'],
    ['pt_company_share', '1000', 'Gross company share before expenses in INR'],
    ['official_upi_id', 'parametricplay@upi', 'Company UPI VPA for direct QR payments']
  ];
  for (const s of defaultSettings) {
    insertSetting.run(s[0], s[1], s[2]);
  }
}

// Seed Users if empty
const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (usersCount === 0) {
  const insertUser = db.prepare('INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('Super Admin', 'admin@parametricplay.com', '8102140650', 'admin', 'admin123');
  insertUser.run('Coach Rajesh Sharma', 'coach.rajesh@parametricplay.com', '9876543210', 'coach', 'coach123');
  insertUser.run('Coach Priya Verma', 'coach.priya@parametricplay.com', '9876543211', 'coach', 'coach123');
  insertUser.run('Coach Vikram Singh', 'coach.vikram@parametricplay.com', '9876543212', 'coach', 'coach123');
  insertUser.run('St. Xavier Global Academy', 'principal@xavierschool.edu', '9811223344', 'school_admin', 'school123');
  insertUser.run('Palm Greens Residency RWA', 'manager@palmgreens.in', '9822334455', 'society_manager', 'society123');
  insertUser.run('Amit Singhania (Parent)', 'parent.amit@gmail.com', '9988776655', 'customer', 'customer123');
}

// Seed Categories if empty
const catCount = db.prepare('SELECT COUNT(*) as count FROM personal_training_categories').get().count;
if (catCount === 0) {
  const insertCat = db.prepare(`
    INSERT INTO personal_training_categories 
    (name, description, age_groups, training_modes, duration_minutes, monthly_price, coach_share, company_share) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const categories = [
    ['Aerobics', 'Cardio-vascular conditioning, rhythm movement, and endurance workout for all ages.', 'Teens, Adults, Seniors', JSON.stringify(['Home Visit', 'Online', 'In-Person']), 60, 2000, 1000, 1000],
    ['Yoga', 'Asana practice, pranayama, balance, flexibility, and mindfulness stress relief.', 'All Ages (6-75)', JSON.stringify(['Home Visit', 'Online', 'In-Person']), 60, 2000, 1000, 1000],
    ['Fitness Training', 'Full-body functional movement, core stability, calorie burn, and general athletic fitness.', 'Teens, Adults', JSON.stringify(['Home Visit', 'Online', 'In-Person']), 60, 2000, 1000, 1000],
    ['Gym Training', 'Hypertrophy, resistance training, form coaching, and progressive overload.', '16+ Adults', JSON.stringify(['Home Visit', 'In-Person']), 60, 2000, 1000, 1000],
    ['Strength and Conditioning', 'Athletic power, speed, agility, and injury prevention for competitive or recreational athletes.', '12-45 Years', JSON.stringify(['Home Visit', 'Online', 'In-Person']), 60, 2000, 1000, 1000],
    ['Karate', 'Traditional Shotokan Karate kata, kumite, discipline, and self-defense belts progression.', 'Kids (5+), Teens, Adults', JSON.stringify(['Home Visit', 'Online', 'In-Person']), 60, 2000, 1000, 1000],
    ['Judo', 'Grappling, throws, leverage mechanics, balance control, and safe fall techniques.', 'Kids (7+), Teens, Adults', JSON.stringify(['Home Visit', 'In-Person']), 60, 2000, 1000, 1000],
    ['Taekwondo', 'Dynamic kicking techniques, speed sparring, flexibility, and Olympic style patterns.', 'Kids (5+), Teens, Adults', JSON.stringify(['Home Visit', 'Online', 'In-Person']), 60, 2000, 1000, 1000],
    ['Boxing', 'Stance, footwork, punch combos, defensive slipping, and heavy bag conditioning.', '12+ Teens, Adults', JSON.stringify(['Home Visit', 'In-Person']), 60, 2000, 1000, 1000],
    ['Martial Arts', 'Integrated mixed martial arts, physical self-defense, and combat conditioning.', 'Teens, Adults', JSON.stringify(['Home Visit', 'Online', 'In-Person']), 60, 2000, 1000, 1000]
  ];
  for (const c of categories) {
    insertCat.run(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]);
  }
}

// Seed Coaches if empty
const coachCount = db.prepare('SELECT COUNT(*) as count FROM coach_profiles').get().count;
if (coachCount === 0) {
  const insertCoach = db.prepare(`
    INSERT INTO coach_profiles 
    (user_id, full_name, email, phone, state, city, pincode, service_area, sports_specialisations, qualifications, experience_years, age_groups_served, online_available, home_visit_available, verification_status, monthly_earnings, rating, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertCoach.run(
    2,
    'Rajesh Sharma',
    'coach.rajesh@parametricplay.com',
    '9876543210',
    'Delhi NCR',
    'New Delhi',
    '110001',
    'South Delhi, Central Delhi, Connaught Place',
    JSON.stringify(['Fitness Training', 'Strength and Conditioning', 'Boxing', 'Football']),
    'B.P.Ed (Lakshmibai National Institute of Physical Education), NSNIS Diploma in Fitness',
    8,
    'Kids, Teens, Adults',
    1,
    1,
    'Verified',
    6000,
    4.95,
    'Former state-level athlete with 8+ years coaching experience in youth athletics and strength conditioning.'
  );

  insertCoach.run(
    3,
    'Priya Verma',
    'coach.priya@parametricplay.com',
    '9876543211',
    'Maharashtra',
    'Mumbai',
    '400050',
    'Bandra, Khar, Santacruz, Andheri West',
    JSON.stringify(['Yoga', 'Aerobics', 'Kids Fitness', 'Badminton']),
    'M.Sc. Yoga Sciences (Kaivalyadhama), Certified Aerobics & Pilates Instructor',
    6,
    'All Ages (Kids, Adults, Seniors)',
    1,
    1,
    'Verified',
    8000,
    4.98,
    'Specialist in posture correction, breathing techniques, dynamic yoga flow, and joyful kids fitness games.'
  );

  insertCoach.run(
    4,
    'Vikram Singh',
    'coach.vikram@parametricplay.com',
    '9876543212',
    'Karnataka',
    'Bengaluru',
    '560034',
    'Koramangala, HSR Layout, Indiranagar, Bellandur',
    JSON.stringify(['Karate', 'Taekwondo', 'Martial Arts', 'Gym Training']),
    'Black Belt 3rd Dan Shotokan, Certified Strength Coach (ACE)',
    9,
    'Kids (5+), Teens, Adults',
    1,
    1,
    'Verified',
    10000,
    4.92,
    'Passionate martial arts sensei focused on discipline, self-defense, agility, and mental resilience.'
  );
}

// Seed City Coverage
const cityCount = db.prepare('SELECT COUNT(*) as count FROM city_coverage').get().count;
if (cityCount === 0) {
  const insertCity = db.prepare('INSERT INTO city_coverage (state, city, pincode_prefix, coach_count, status) VALUES (?, ?, ?, ?, ?)');
  const cities = [
    ['Delhi NCR', 'New Delhi', '110', 12, 'Active'],
    ['Delhi NCR', 'Noida & Gr. Noida', '201', 8, 'Active'],
    ['Delhi NCR', 'Gurugram', '122', 10, 'Active'],
    ['Maharashtra', 'Mumbai', '400', 15, 'Active'],
    ['Maharashtra', 'Pune', '411', 7, 'Active'],
    ['Karnataka', 'Bengaluru', '560', 14, 'Active'],
    ['Telangana', 'Hyderabad', '500', 9, 'Active'],
    ['Tamil Nadu', 'Chennai', '600', 6, 'Active'],
    ['West Bengal', 'Kolkata', '700', 5, 'Active'],
    ['Gujarat', 'Ahmedabad', '380', 4, 'Active'],
    ['Rajasthan', 'Jaipur', '302', 3, 'Active'],
    ['Uttar Pradesh', 'Lucknow', '226', 2, 'Coming Soon'],
    ['Punjab', 'Chandigarh', '160', 4, 'Active'],
    ['Kerala', 'Kochi', '682', 1, 'Coming Soon'],
    ['Madhya Pradesh', 'Indore', '452', 0, 'Waitlist Open'],
    ['Goa', 'Panaji', '403', 0, 'Waitlist Open']
  ];
  for (const c of cities) {
    insertCity.run(c[0], c[1], c[2], c[3], c[4]);
  }
}

// Seed Schools if empty
const schoolCount = db.prepare('SELECT COUNT(*) as count FROM school_enquiries').get().count;
if (schoolCount === 0) {
  const insertSchool = db.prepare(`
    INSERT INTO school_enquiries 
    (school_name, school_board, school_address, state, city, pincode, principal_name, contact_name, phone, email, total_students, num_classes, existing_pti_staff, sports_facilities, sports_offered, sports_wanted, available_equipment, preferred_meeting_date, proposed_coach_count, meets_min_requirement, proposed_price_monthly, contract_value_annual, status, curriculum_config)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // St. Xavier: 1,600 students -> Ceiling(1600 / 400) = 4 coaches
  insertSchool.run(
    'St. Xavier Global Academy',
    'CBSE',
    'Plot 45, Institutional Area, Sector 62',
    'Delhi NCR',
    'Noida',
    '201309',
    'Dr. Aruna Chatterjee',
    'Mr. Ramanath Iyer (Sports Coordinator)',
    '9811223344',
    'principal@xavierschool.edu',
    1600,
    8,
    '1 PTI (part-time)',
    '1 Football ground, 2 Basketball courts, Indoor TT hall',
    'Football, Basketball, Table Tennis',
    'Cricket, Athletics, Kho-Kho, Yoga, Aerobics',
    'Basic footballs and basketballs',
    '2026-11-10',
    4,
    1,
    80000,
    960000,
    'Active',
    JSON.stringify({
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
      periods: 8,
      focus: 'Foundational motor skills for primary, sport-specific skill progression for middle school'
    })
  );

  // Greenfield Public School: 650 students (< 800 minimum)
  insertSchool.run(
    'Greenfield Heights School',
    'ICSE',
    'Sector 14, Ring Road',
    'Karnataka',
    'Bengaluru',
    '560034',
    'Mrs. Susan George',
    'Mr. Anil Mehta',
    '9844556677',
    'contact@greenfieldheights.edu',
    650,
    6,
    'None',
    '1 Open playground',
    'Cricket',
    'Football, Kho-Kho, Yoga',
    'Cricket bats, wickets',
    '2026-11-15',
    2,
    0, // Under 800 minimum requirement!
    35000,
    420000,
    'Under Review',
    JSON.stringify({ note: 'Special enquiry: Student strength 650 is under standard 800 eligibility threshold. Subject to manual admin approval.' })
  );

  // Delhi Public Heritage: 2,400 students -> Ceiling(2400 / 400) = 6 coaches
  insertSchool.run(
    'Delhi Public Heritage International',
    'CBSE',
    'Knowledge Park III, Expressway',
    'Delhi NCR',
    'Greater Noida',
    '201308',
    'Prof. K. K. Sharma',
    'Dr. Meenakshi Sundaram',
    '9899112233',
    'sports@dphinternational.edu',
    2400,
    10,
    '2 PTIs',
    'Multi-sport complex, 400m synthetic track, Swimming pool, 3 Basketball courts',
    'Athletics, Basketball, Swimming',
    'Football, Kabaddi, Kho-Kho, Yoga, Badminton',
    'Full athletic hurdles, stopwatches, balls',
    '2026-11-05',
    6,
    1,
    120000,
    1440000,
    'Proposal Sent',
    JSON.stringify({
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
      periods: 8,
      focus: 'Elite physical literacy, inter-school tournament readiness, annual sports day execution'
    })
  );
}

// Seed Residential Societies if empty
const societyCount = db.prepare('SELECT COUNT(*) as count FROM residential_societies').get().count;
if (societyCount === 0) {
  const insertSociety = db.prepare(`
    INSERT INTO residential_societies 
    (society_name, address, state, city, pincode, contact_name, phone, email, selected_programme, child_count, age_range, session_duration, sessions_per_week, fee_per_child, gross_monthly_fee, status, assigned_coach_id, equipment_included)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Palm Greens: 18 children, Football, Active
  insertSociety.run(
    'Palm Greens Residency RWA',
    'Golf Course Extension Road, Sector 56',
    'Delhi NCR',
    'Gurugram',
    '122011',
    'Mr. Sandeep Kapoor (RWA President)',
    '9822334455',
    'manager@palmgreens.in',
    'Football',
    18,
    '6 - 14 Years',
    '1-hour',
    3,
    2000,
    36000, // 18 * 2000 = 36000 gross
    'Active',
    1,
    JSON.stringify(['15 Training Footballs Size 4', '40 Agility Cones', '2 Portable Mini Goalposts', '20 Training Bibs'])
  );

  // Silver Oak Park: 8 children (< 10 minimum), Pending
  insertSociety.run(
    'Silver Oak Park Apartments',
    'Sarjapur Main Road, Bellandur',
    'Karnataka',
    'Bengaluru',
    '560103',
    'Mrs. Ananya Ray',
    '9877001122',
    'secretary@silveroakpark.org',
    'Kids Fitness Programme',
    8,
    '5 - 11 Years',
    '1-hour',
    3,
    2000,
    16000, // 8 * 2000 = 16000 gross
    'Minimum Enrolment Pending', // Below 10 minimum!
    3,
    JSON.stringify(['Agility ladder', 'Balance discs', 'Foam hurdles', 'Speed rings'])
  );

  // Windchimes Meadows: 12 children, Kids Fitness & Badminton, Active
  insertSociety.run(
    'Windchimes Meadows Co-op Society',
    'Lokhandwala Complex, Andheri West',
    'Maharashtra',
    'Mumbai',
    '400053',
    'Capt. Rohit Deshmukh',
    '9819223344',
    'sports@windchimesmumbai.com',
    'Kids Fitness & Movement',
    14,
    '6 - 13 Years',
    '1-hour',
    3,
    2000,
    28000, // 14 * 2000 = 28000 gross
    'Active',
    2,
    JSON.stringify(['Fitness hurdles', 'Skipping ropes', 'Medicine balls (1kg)', 'Reaction balls'])
  );
}

// Seed Bookings if empty
const bookingCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
if (bookingCount === 0) {
  const insertBooking = db.prepare(`
    INSERT INTO bookings 
    (booking_code, customer_id, customer_name, customer_phone, customer_email, service_type, category_name, training_mode, address, city, pincode, preferred_slot, session_date, monthly_price, coach_id, coach_name, video_meeting_link, status, payment_status, payment_method, utr_transaction_ref)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(
    'PP-BK-8901',
    7,
    'Amit Singhania',
    '9988776655',
    'parent.amit@gmail.com',
    'Personal Training Home',
    'Fitness Training',
    'Home Visit',
    'Tower B, Flat 804, Palm Greens, Sector 56',
    'Gurugram',
    '122011',
    'Morning 7:00 AM - 8:00 AM (Mon/Wed/Fri)',
    '2026-11-02',
    2000,
    1,
    'Rajesh Sharma',
    null,
    'Confirmed',
    'verified',
    'UPI QR',
    'UPI429019284019'
  );

  insertBooking.run(
    'PP-BK-8902',
    7,
    'Neha Singhania',
    '9988776656',
    'neha.singhania@gmail.com',
    'Personal Training Online',
    'Yoga',
    'Online',
    'Online Session via Live Video',
    'Mumbai',
    '400050',
    'Evening 6:00 PM - 7:00 PM (Tue/Thu/Sat)',
    '2026-11-03',
    2000,
    2,
    'Priya Verma',
    'https://meet.parametricplay.com/room/pp-yoga-live-8902',
    'Confirmed',
    'verified',
    'UPI QR',
    'UPI429019284020'
  );

  insertBooking.run(
    'PP-BK-8903',
    null,
    'Kavita Nair',
    '9820114477',
    'kavita.nair@outlook.com',
    'Personal Training Home',
    'Karate',
    'Home Visit',
    'Villa 12, Sobha Morzaria Grandeur, Bannerghatta',
    'Bengaluru',
    '560029',
    'Morning 8:00 AM - 9:00 AM (Mon/Wed/Fri)',
    '2026-11-04',
    2000,
    3,
    'Vikram Singh',
    null,
    'Payment Pending Verification',
    'pending',
    'UPI QR',
    'UPI992019482012'
  );
}

// Seed Financial Ledger if empty
const finCount = db.prepare('SELECT COUNT(*) as count FROM financial_transactions').get().count;
if (finCount === 0) {
  const insertTxn = db.prepare(`
    INSERT INTO financial_transactions 
    (date, vertical, reference_id, client_name, gross_amount, coach_payout, company_gross, operating_expenses, net_result, payment_mode, payout_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Personal Training: ₹2,000 fee -> ₹1,000 coach / ₹1,000 company share
  insertTxn.run('2026-10-01', 'Personal Training', 'PP-BK-8901', 'Amit Singhania', 2000, 1000, 1000, 150, 850, 'UPI QR', 'Paid Out');
  insertTxn.run('2026-10-02', 'Personal Training', 'PP-BK-8902', 'Neha Singhania', 2000, 1000, 1000, 120, 880, 'UPI QR', 'Paid Out');
  insertTxn.run('2026-10-05', 'Personal Training', 'PP-BK-8899', 'Rohan Mathur', 2000, 1000, 1000, 150, 850, 'UPI QR', 'Pending Payout');

  // Residential Society: Palm Greens 18 kids * 2000 = ₹36,000
  insertTxn.run('2026-10-01', 'Residential Society', 'SOC-101', 'Palm Greens Residency (18 kids)', 36000, 16000, 20000, 3200, 16800, 'Bank Transfer', 'Paid Out');
  // Windchimes Meadows: 14 kids * 2000 = ₹28,000
  insertTxn.run('2026-10-03', 'Residential Society', 'SOC-103', 'Windchimes Meadows (14 kids)', 28000, 12000, 16000, 2500, 13500, 'Bank Transfer', 'Paid Out');

  // School Sports: St. Xavier Global Academy = ₹80,000 / month
  insertTxn.run('2026-10-01', 'School Sports', 'SCH-201', 'St. Xavier Global Academy (1,600 students, 4 coaches)', 80000, 48000, 32000, 6000, 26000, 'NEFT', 'Paid Out');
}

// Seed Equipment if empty
const equipCount = db.prepare('SELECT COUNT(*) as count FROM equipment_inventory').get().count;
if (equipCount === 0) {
  const insertEquip = db.prepare(`
    INSERT INTO equipment_inventory 
    (item_name, category, total_quantity, available_quantity, assigned_to_society_id, condition, cost_per_item, included_in_fee, last_inspected)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEquip.run('Training Footballs Size 4', 'Balls', 40, 25, 1, 'Good', 650, 1, '2026-10-20');
  insertEquip.run('Agility Space Marker Cones', 'Cones & Markers', 150, 110, 1, 'Good', 45, 1, '2026-10-20');
  insertEquip.run('Portable Mini Goalposts (Pair)', 'Goals', 4, 2, 1, 'Good', 4500, 1, '2026-10-18');
  insertEquip.run('Speed & Agility Ladders (6m)', 'Fitness Gear', 12, 8, 3, 'Good', 850, 1, '2026-10-15');
  insertEquip.run('Skipping Speed Ropes', 'Fitness Gear', 60, 45, 3, 'Good', 180, 1, '2026-10-15');
  insertEquip.run('Reaction Coordination Balls', 'Fitness Gear', 30, 20, 3, 'Good', 250, 1, '2026-10-15');
  insertEquip.run('Medicine Balls (2kg & 3kg)', 'Weights', 20, 16, null, 'Good', 950, 1, '2026-10-10');
  insertEquip.run('First Aid Sports Emergency Kit', 'Safety', 10, 7, 1, 'Good', 1200, 1, '2026-10-22');
}

// Seed QR Codes if empty
const qrCount = db.prepare('SELECT COUNT(*) as count FROM qr_codes').get().count;
if (qrCount === 0) {
  const insertQR = db.prepare(`
    INSERT INTO qr_codes 
    (title, campaign_type, destination_url, is_official_payment, is_active, scan_count, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertQR.run(
    'Official Parametric Play UPI Payment QR',
    'Official Payment UPI',
    'upi://pay?pa=parametricplay@upi&pn=Parametric%20Play&cu=INR',
    1,
    1,
    234,
    'Primary company UPI payment code for sports coaching bookings & society fees'
  );

  insertQR.run(
    'Personal Training Fast Booking QR',
    'Personal Training Booking',
    'https://parametricplay.com/book-training',
    0,
    1,
    412,
    'Printed on marketing flyers, society notice boards, and sports complexes'
  );

  insertQR.run(
    'School Sports Partnership Brochure QR',
    'School Partnership Enquiry',
    'https://parametricplay.com/school-sports',
    0,
    1,
    88,
    'Distributed at principal conferences and school board summits'
  );

  insertQR.run(
    'Residential Society Coaching Programme QR',
    'Residential Society Registration',
    'https://parametricplay.com/residential-societies',
    0,
    1,
    195,
    'For RWA noticeboards, Clubhouse flyers, and society WhatsApp groups'
  );
}

// Seed Notifications if empty
const notifCount = db.prepare('SELECT COUNT(*) as count FROM notifications').get().count;
if (notifCount === 0) {
  const insertNotif = db.prepare(`
    INSERT INTO notifications (user_id, title, message, type, is_read)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertNotif.run('admin', 'New School Enquiry: St. Xavier', 'St. Xavier Global Academy submitted an enquiry with 1,600 students (Eligible, 4 coaches proposed).', 'enquiry', 0);
  insertNotif.run('admin', 'Payment Verification Pending', 'Booking PP-BK-8903 has submitted UTR UPI992019482012 awaiting admin verification.', 'payment', 0);
  insertNotif.run('admin', 'Society Minimum Enrolment Alert', 'Silver Oak Park has 8/10 kids registered. Action needed for batch launch.', 'enquiry', 0);
  insertNotif.run('admin', 'Coach Payout Due', 'Coach Vikram Singh has 2 completed client-months pending payout confirmation.', 'payout', 0);
}

module.exports = db;
