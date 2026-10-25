const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Upload storage configuration
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Serve client build if available
const clientDist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* ==========================================================================
   1. SYSTEM SETTINGS & COMPANY INFO
   ========================================================================== */
app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM system_settings').all();
  const settings = {};
  for (const r of rows) settings[r.key] = r.value;
  res.json({ success: true, settings });
});

app.put('/api/settings', (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Settings object required' });
  }
  const updateStmt = db.prepare(`
    INSERT INTO system_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  for (const [key, value] of Object.entries(settings)) {
    updateStmt.run(key, String(value));
  }
  res.json({ success: true, message: 'Settings updated successfully' });
});

/* ==========================================================================
   2. AUTHENTICATION & USERS
   ========================================================================== */
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  let user;
  if (email) {
    user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  } else if (role) {
    user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE role = ? LIMIT 1').get(role);
  }

  if (!user) {
    return res.status(401).json({ error: 'User not found or invalid credentials' });
  }

  res.json({
    success: true,
    user,
    token: `demo-token-${user.id}-${Date.now()}`
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !phone || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const info = db.prepare(`
      INSERT INTO users (name, email, phone, role, password)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, phone, role, password || 'password123');

    const newUser = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
});

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC').all();
  res.json({ success: true, users });
});

/* ==========================================================================
   3. COACH MANAGEMENT & VERIFICATION
   ========================================================================== */
app.get('/api/coaches', (req, res) => {
  // Public endpoint: returns only Verified coaches
  const coaches = db.prepare(`
    SELECT id, full_name, email, phone, state, city, pincode, service_area, sports_specialisations,
           qualifications, experience_years, age_groups_served, online_available, home_visit_available,
           preferred_hours, photo_url, rating, bio
    FROM coach_profiles
    WHERE verification_status = 'Verified'
    ORDER BY rating DESC
  `).all();
  res.json({ success: true, coaches });
});

app.get('/api/coaches/admin/all', (req, res) => {
  // Admin endpoint: returns all coaches with full verification and earnings info
  const coaches = db.prepare(`
    SELECT * FROM coach_profiles ORDER BY id DESC
  `).all();
  res.json({ success: true, coaches });
});

app.post('/api/coaches/apply', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 },
  { name: 'certificates', maxCount: 1 }
]), (req, res) => {
  const {
    fullName, email, phone, state, city, pincode, serviceArea,
    sportsSpecialisations, qualifications, experienceYears, ageGroupsServed,
    onlineAvailable, homeVisitAvailable, preferredHours, bio
  } = req.body;

  if (!fullName || !email || !phone || !city) {
    return res.status(400).json({ error: 'Full name, email, phone, and city are mandatory' });
  }

  const photoUrl = req.files && req.files.photo ? `/uploads/${req.files.photo[0].filename}` : null;
  const idDocumentUrl = req.files && req.files.idDocument ? `/uploads/${req.files.idDocument[0].filename}` : null;
  const certificatesUrl = req.files && req.files.certificates ? `/uploads/${req.files.certificates[0].filename}` : null;

  try {
    // Also create user if not exists
    let user = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email);
    let userId = user ? user.id : null;
    if (!userId) {
      const uInfo = db.prepare('INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)').run(fullName, email, phone, 'coach');
      userId = uInfo.lastInsertRowid;
    }

    const info = db.prepare(`
      INSERT INTO coach_profiles 
      (user_id, full_name, email, phone, state, city, pincode, service_area, sports_specialisations, qualifications, experience_years, age_groups_served, online_available, home_visit_available, preferred_hours, photo_url, id_document_url, certificates_url, verification_status, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Under Review', ?)
    `).run(
      userId, fullName, email, phone, state || 'India', city, pincode || '110001', serviceArea || city,
      JSON.stringify(sportsSpecialisations ? (Array.isArray(sportsSpecialisations) ? sportsSpecialisations : [sportsSpecialisations]) : ['Fitness Training']),
      qualifications || 'Certified Sports Coach',
      Number(experienceYears) || 2,
      ageGroupsServed || 'Kids & Adults',
      onlineAvailable === '1' || onlineAvailable === true || onlineAvailable === 'true' ? 1 : 0,
      homeVisitAvailable === '1' || homeVisitAvailable === true || homeVisitAvailable === 'true' ? 1 : 0,
      preferredHours || 'Morning & Evening',
      photoUrl, idDocumentUrl, certificatesUrl, bio || ''
    );

    // Notify admin
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ('admin', 'New Coach Application', ?, 'coach_verification')
    `).run(`Coach ${fullName} (${city}) has submitted their application and documents for verification.`);

    res.json({
      success: true,
      message: 'Application submitted successfully. Our team will verify your credentials before publishing your profile.',
      coachId: info.lastInsertRowid
    });
  } catch (err) {
    console.error('Coach apply error:', err);
    res.status(500).json({ error: 'Failed to submit application: ' + err.message });
  }
});

app.put('/api/coaches/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['Application Received', 'Documents Pending', 'Under Review', 'Verified', 'Rejected', 'Suspended'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.prepare('UPDATE coach_profiles SET verification_status = ? WHERE id = ?').run(status, id);
  res.json({ success: true, message: `Coach status updated to ${status}` });
});

/* ==========================================================================
   4. BUSINESS MODEL ONE: SCHOOL SPORTS MANAGEMENT
   ========================================================================== */
app.get('/api/schools', (req, res) => {
  const schools = db.prepare('SELECT * FROM school_enquiries ORDER BY id DESC').all();
  res.json({ success: true, schools });
});

app.post('/api/schools/enquire', (req, res) => {
  const {
    schoolName, schoolBoard, schoolAddress, state, city, pincode,
    principalName, contactName, phone, email, totalStudents, numClasses,
    existingPtiStaff, sportsFacilities, sportsOffered, sportsWanted,
    availableEquipment, preferredMeetingDate, additionalRequirements
  } = req.body;

  const students = Number(totalStudents) || 0;
  if (!schoolName || !phone || !email || students <= 0) {
    return res.status(400).json({ error: 'School name, phone, email, and valid student count are required' });
  }

  // Formula Requirement:
  // Minimum student strength = 800
  // Proposed coaches ratio = Ceiling(totalStudents / 400)
  const meetsMinRequirement = students >= 800 ? 1 : 0;
  const proposedCoaches = Math.ceil(students / 400);

  // Proposed baseline fee: ₹20,000 per coach/month approx or ₹50/student/month
  const proposedPriceMonthly = proposedCoaches * 22000;
  const contractValueAnnual = proposedPriceMonthly * 12;

  const info = db.prepare(`
    INSERT INTO school_enquiries 
    (school_name, school_board, school_address, state, city, pincode, principal_name, contact_name, phone, email, total_students, num_classes, existing_pti_staff, sports_facilities, sports_offered, sports_wanted, available_equipment, preferred_meeting_date, additional_requirements, proposed_coach_count, meets_min_requirement, proposed_price_monthly, contract_value_annual, status, curriculum_config)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Enquiry Received', ?)
  `).run(
    schoolName, schoolBoard || 'CBSE', schoolAddress || '', state || 'India', city || '', pincode || '',
    principalName || '', contactName || principalName || '', phone, email,
    students, Number(numClasses) || 8, existingPtiStaff || 'None', sportsFacilities || '', sportsOffered || '',
    sportsWanted || '', availableEquipment || '', preferredMeetingDate || '', additionalRequirements || '',
    proposedCoaches, meetsMinRequirement, proposedPriceMonthly, contractValueAnnual,
    JSON.stringify({
      classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
      periods: 8,
      sportsPlan: sportsWanted || 'Athletics, Football, Yoga, Aerobics, Kho-Kho'
    })
  );

  // In-app notification for admin
  db.prepare(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES ('admin', 'New School Partnership Enquiry', ?, 'enquiry')
  `).run(`${schoolName} (${students} students, ${proposedCoaches} coaches proposed) submitted an enquiry. Status: ${meetsMinRequirement ? 'Standard Eligible' : 'Requires Special Review (<800 students)'}`);

  res.json({
    success: true,
    enquiryId: info.lastInsertRowid,
    calculation: {
      totalStudents: students,
      meetsMinRequirement: !!meetsMinRequirement,
      proposedCoachCount: proposedCoaches,
      ratioExplanation: `Proposed ratio formula: 1 PTI / Sports Coach per 400 students = Ceiling(${students} ÷ 400) = ${proposedCoaches} Coaches`,
      eligibilityMessage: meetsMinRequirement 
        ? `Eligible for Standard Parametric Play School Partnership (Minimum 800 students threshold met).`
        : `Note: The standard school programme requires at least 800 students. Your enquiry for ${students} students has been submitted for manual administrator review.`
    }
  });
});

app.put('/api/schools/:id/pricing', (req, res) => {
  const { id } = req.params;
  const { proposedPriceMonthly, contractValueAnnual, status } = req.body;
  db.prepare(`
    UPDATE school_enquiries 
    SET proposed_price_monthly = COALESCE(?, proposed_price_monthly),
        contract_value_annual = COALESCE(?, contract_value_annual),
        status = COALESCE(?, status)
    WHERE id = ?
  `).run(proposedPriceMonthly, contractValueAnnual, status, id);
  res.json({ success: true, message: 'School pricing and proposal updated successfully' });
});

/* ==========================================================================
   5. BUSINESS MODEL TWO: RESIDENTIAL SOCIETY SPORTS & FITNESS
   ========================================================================== */
app.get('/api/societies', (req, res) => {
  const societies = db.prepare(`
    SELECT r.*, c.full_name as coach_name, c.phone as coach_phone 
    FROM residential_societies r
    LEFT JOIN coach_profiles c ON r.assigned_coach_id = c.id
    ORDER BY r.id DESC
  `).all();
  res.json({ success: true, societies });
});

app.post('/api/societies/register', (req, res) => {
  const {
    societyName, address, state, city, pincode, contactName, phone, email,
    selectedProgramme, childCount, ageRange, sessionDuration, sessionsPerWeek
  } = req.body;

  const children = Number(childCount) || 0;
  if (!societyName || !phone || !email || children <= 0) {
    return res.status(400).json({ error: 'Society name, contact phone, email, and child count are required' });
  }

  // Rule:
  // Standard minimum requirement = 10 participating children
  // Standard fee: ₹2,000 per child per month
  // Gross Monthly Fee = children * 2000
  const meetsMinEnrolment = children >= 10;
  const initialStatus = meetsMinEnrolment ? 'Enquiry Received' : 'Minimum Enrolment Pending';
  const feePerChild = 2000;
  const grossMonthlyFee = children * feePerChild;

  const info = db.prepare(`
    INSERT INTO residential_societies 
    (society_name, address, state, city, pincode, contact_name, phone, email, selected_programme, child_count, age_range, session_duration, sessions_per_week, fee_per_child, gross_monthly_fee, status, equipment_included)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    societyName, address || '', state || 'India', city || '', pincode || '', contactName || '', phone, email,
    selectedProgramme || 'Kids Fitness Programme',
    children, ageRange || '5-14 Years', sessionDuration || '1-hour', Number(sessionsPerWeek) || 3,
    feePerChild, grossMonthlyFee, initialStatus,
    JSON.stringify(['Agility Cones', 'Training Footballs / Fitness Gear', 'First Aid Kit'])
  );

  // Notify admin
  db.prepare(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES ('admin', 'New Residential Society Programme Request', ?, 'enquiry')
  `).run(`${societyName} (${children} children, ₹${grossMonthlyFee.toLocaleString('en-IN')}/mo gross). Status: ${initialStatus}`);

  res.json({
    success: true,
    societyId: info.lastInsertRowid,
    calculation: {
      childCount: children,
      meetsMinEnrolment,
      feePerChild,
      grossMonthlyFee,
      status: initialStatus,
      statusMessage: meetsMinEnrolment
        ? `Sufficient enrolment to qualify for batch launch review (10+ children).`
        : `Programme marked as 'Minimum Enrolment Pending' (requires at least 10 children to start).`
    }
  });
});

app.put('/api/societies/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, assignedCoachId } = req.body;
  db.prepare(`
    UPDATE residential_societies 
    SET status = COALESCE(?, status),
        assigned_coach_id = COALESCE(?, assigned_coach_id)
    WHERE id = ?
  `).run(status, assignedCoachId, id);
  res.json({ success: true, message: 'Society programme status updated successfully' });
});

/* ==========================================================================
   6. BUSINESS MODEL THREE: PERSONAL TRAINING & BOOKINGS
   ========================================================================== */
app.get('/api/personal-training/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM personal_training_categories WHERE is_active = 1').all();
  res.json({ success: true, categories });
});

app.get('/api/bookings', (req, res) => {
  const { customerId, coachId, role } = req.query;
  let bookings;
  if (role === 'admin') {
    bookings = db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
  } else if (coachId) {
    bookings = db.prepare('SELECT * FROM bookings WHERE coach_id = ? ORDER BY id DESC').all(coachId);
  } else if (customerId) {
    bookings = db.prepare('SELECT * FROM bookings WHERE customer_id = ? ORDER BY id DESC').all(customerId);
  } else {
    bookings = db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
  }
  res.json({ success: true, bookings });
});

app.post('/api/bookings', (req, res) => {
  const {
    customerName, customerPhone, customerEmail, serviceType, categoryName,
    trainingMode, address, city, pincode, preferredSlot, sessionDate, notes
  } = req.body;

  if (!customerName || !customerPhone || !categoryName || !trainingMode || !city) {
    return res.status(400).json({ error: 'Customer name, phone, category, training mode, and city are mandatory' });
  }

  try {
    // Generate unique booking ID e.g. PP-BK-9182
    const bookingCode = `PP-BK-${Math.floor(1000 + Math.random() * 9000)}`;

    // Find an available verified coach matching city and category
    const availableCoaches = db.prepare(`
      SELECT id, full_name, email FROM coach_profiles 
      WHERE verification_status = 'Verified' 
        AND (city LIKE ? OR ? LIKE '%' || city || '%')
      LIMIT 1
    `).all(`%${city}%`, city);

    const assignedCoach = availableCoaches.length > 0 ? availableCoaches[0] : null;

    // Monthly package price = ₹2,000 (Split: ₹1,000 Coach / ₹1,000 Company Share before expenses)
    const monthlyPrice = 2000;

    const info = db.prepare(`
      INSERT INTO bookings 
      (booking_code, customer_name, customer_phone, customer_email, service_type, category_name, training_mode, address, city, pincode, preferred_slot, session_date, monthly_price, coach_id, coach_name, status, payment_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(
      bookingCode, customerName, customerPhone, customerEmail || '',
      serviceType || 'Personal Training', categoryName, trainingMode,
      address || (trainingMode === 'Online' ? 'Online Session' : ''), city, pincode || '',
      preferredSlot || 'Morning 7:00 AM - 8:00 AM', sessionDate || new Date().toISOString().split('T')[0],
      monthlyPrice,
      assignedCoach ? assignedCoach.id : null,
      assignedCoach ? assignedCoach.full_name : 'To be assigned by admin',
      'Awaiting Payment',
      notes || ''
    );

    // Notify admin
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ('admin', 'New Booking Created', ?, 'booking')
    `).run(`Booking ${bookingCode} for ${categoryName} (${trainingMode}) created by ${customerName}. Awaiting payment.`);

    res.json({
      success: true,
      bookingId: info.lastInsertRowid,
      bookingCode,
      monthlyPrice,
      coachAllocation: 1000,
      companyShare: 1000,
      assignedCoach: assignedCoach ? assignedCoach.full_name : null,
      message: 'Booking created successfully. Proceed to payment verification.'
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to create booking: ' + err.message });
  }
});

app.put('/api/bookings/:id/submit-payment', (req, res) => {
  const { id } = req.params;
  const { utrTransactionRef, paymentMethod } = req.body;

  if (!utrTransactionRef) {
    return res.status(400).json({ error: 'UTR / Transaction Reference is required' });
  }

  // Update status to 'Payment Pending Verification'
  // Rule: Do NOT mark payment as successful solely because user clicked a button or entered UTR
  db.prepare(`
    UPDATE bookings 
    SET utr_transaction_ref = ?,
        payment_method = ?,
        status = 'Payment Pending Verification',
        payment_status = 'pending'
    WHERE id = ?
  `).run(utrTransactionRef, paymentMethod || 'UPI QR', id);

  const booking = db.prepare('SELECT booking_code, customer_name FROM bookings WHERE id = ?').get(id);

  // Notify admin for manual reconciliation
  db.prepare(`
    INSERT INTO notifications (user_id, title, message, type)
    VALUES ('admin', 'Payment Awaiting Verification', ?, 'payment')
  `).run(`Customer ${booking ? booking.customer_name : ''} (${booking ? booking.booking_code : ''}) submitted UTR ${utrTransactionRef}. Please verify in your bank account.`);

  res.json({
    success: true,
    message: 'Payment reference submitted. Your booking is under verification by our accounts team.'
  });
});

app.put('/api/bookings/:id/verify-payment', (req, res) => {
  const { id } = req.params;
  const { verified, videoMeetingLink } = req.body;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (verified) {
    const finalVideoLink = videoMeetingLink || (booking.training_mode === 'Online' ? `https://meet.parametricplay.com/room/${booking.booking_code}` : null);
    db.prepare(`
      UPDATE bookings 
      SET status = 'Confirmed',
          payment_status = 'verified',
          video_meeting_link = ?
      WHERE id = ?
    `).run(finalVideoLink, id);

    // Record in financial ledger: ₹2,000 gross, ₹1,000 coach payout, ₹1,000 company gross
    db.prepare(`
      INSERT INTO financial_transactions 
      (date, vertical, reference_id, client_name, gross_amount, coach_payout, company_gross, operating_expenses, net_result, payment_mode, payout_status)
      VALUES (?, 'Personal Training', ?, ?, 2000, 1000, 1000, 150, 850, ?, 'Pending Payout')
    `).run(
      new Date().toISOString().split('T')[0],
      booking.booking_code,
      booking.customer_name,
      booking.payment_method || 'UPI QR'
    );

    // If coach assigned, credit coach earnings
    if (booking.coach_id) {
      db.prepare(`
        UPDATE coach_profiles 
        SET monthly_earnings = monthly_earnings + 1000
        WHERE id = ?
      `).run(booking.coach_id);
    }

    res.json({ success: true, message: 'Payment verified successfully and booking confirmed!' });
  } else {
    db.prepare(`
      UPDATE bookings 
      SET status = 'Awaiting Payment',
          payment_status = 'failed'
      WHERE id = ?
    `).run(id);
    res.json({ success: true, message: 'Payment rejected. Booking marked as awaiting valid payment.' });
  }
});

app.put('/api/bookings/:id/assign-coach', (req, res) => {
  const { id } = req.params;
  const { coachId } = req.body;

  const coach = db.prepare('SELECT id, full_name FROM coach_profiles WHERE id = ?').get(coachId);
  if (!coach) return res.status(404).json({ error: 'Coach not found' });

  db.prepare(`
    UPDATE bookings 
    SET coach_id = ?,
        coach_name = ?,
        status = CASE WHEN status = 'Confirmed' THEN 'Coach Assigned' ELSE status END
    WHERE id = ?
  `).run(coach.id, coach.full_name, id);

  res.json({ success: true, message: `Coach ${coach.full_name} assigned to booking.` });
});

/* ==========================================================================
   7. QR CODE MANAGEMENT MODULE
   ========================================================================== */
app.get('/api/qr', (req, res) => {
  const qrs = db.prepare('SELECT * FROM qr_codes WHERE is_active = 1 ORDER BY id DESC').all();
  res.json({ success: true, qrs });
});

app.post('/api/qr/upload-official', upload.single('qrImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a valid QR code image file' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;

  // Update or insert official payment QR
  db.prepare(`
    UPDATE qr_codes 
    SET uploaded_image_url = ?, is_active = 1
    WHERE is_official_payment = 1
  `).run(fileUrl);

  res.json({
    success: true,
    message: 'Official Payment QR uploaded and activated successfully.',
    imageUrl: fileUrl
  });
});

app.post('/api/qr/create', (req, res) => {
  const { title, campaignType, destinationUrl, notes } = req.body;
  if (!title || !destinationUrl) {
    return res.status(400).json({ error: 'Title and Destination URL are required' });
  }

  const info = db.prepare(`
    INSERT INTO qr_codes (title, campaign_type, destination_url, is_official_payment, is_active, scan_count, notes)
    VALUES (?, ?, ?, 0, 1, 0, ?)
  `).run(title, campaignType || 'Marketing Campaign', destinationUrl, notes || '');

  res.json({ success: true, qrId: info.lastInsertRowid });
});

app.post('/api/qr/:id/scan', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = ?').run(id);
  res.json({ success: true });
});

/* ==========================================================================
   8. FINANCIAL & REVENUE MANAGEMENT
   ========================================================================== */
app.get('/api/financials/summary', (req, res) => {
  const totals = db.prepare(`
    SELECT 
      SUM(gross_amount) as totalGrossCollections,
      SUM(coach_payout) as totalCoachPayouts,
      SUM(company_gross) as totalCompanyGross,
      SUM(operating_expenses) as totalOperatingExpenses,
      SUM(net_result) as totalNetProfit
    FROM financial_transactions
  `).get();

  const byVertical = db.prepare(`
    SELECT 
      vertical,
      COUNT(*) as transactionCount,
      SUM(gross_amount) as grossRevenue,
      SUM(coach_payout) as coachAllocation,
      SUM(company_gross) as companyAllocation,
      SUM(operating_expenses) as expenses,
      SUM(net_result) as netResult
    FROM financial_transactions
    GROUP BY vertical
  `).all();

  const recentTransactions = db.prepare(`
    SELECT * FROM financial_transactions ORDER BY id DESC LIMIT 20
  `).all();

  res.json({
    success: true,
    summary: {
      totalGrossCollections: totals.totalGrossCollections || 0,
      totalCoachPayouts: totals.totalCoachPayouts || 0,
      totalCompanyGross: totals.totalCompanyGross || 0,
      totalOperatingExpenses: totals.totalOperatingExpenses || 0,
      totalNetProfit: totals.totalNetProfit || 0
    },
    byVertical,
    recentTransactions
  });
});

/* ==========================================================================
   9. EQUIPMENT INVENTORY
   ========================================================================== */
app.get('/api/equipment', (req, res) => {
  const items = db.prepare(`
    SELECT e.*, s.society_name, c.full_name as coach_name 
    FROM equipment_inventory e
    LEFT JOIN residential_societies s ON e.assigned_to_society_id = s.id
    LEFT JOIN coach_profiles c ON e.assigned_to_coach_id = c.id
    ORDER BY e.id ASC
  `).all();
  res.json({ success: true, items });
});

app.post('/api/equipment', (req, res) => {
  const { itemName, category, totalQuantity, condition, costPerItem, includedInFee } = req.body;
  if (!itemName || !totalQuantity) {
    return res.status(400).json({ error: 'Item name and quantity required' });
  }
  const info = db.prepare(`
    INSERT INTO equipment_inventory 
    (item_name, category, total_quantity, available_quantity, condition, cost_per_item, included_in_fee, last_inspected)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    itemName, category || 'General', Number(totalQuantity), Number(totalQuantity),
    condition || 'Good', Number(costPerItem) || 500, includedInFee ? 1 : 0,
    new Date().toISOString().split('T')[0]
  );
  res.json({ success: true, itemId: info.lastInsertRowid });
});

/* ==========================================================================
   10. PAN-INDIA CITY COVERAGE
   ========================================================================== */
app.get('/api/city-coverage', (req, res) => {
  const cities = db.prepare('SELECT * FROM city_coverage ORDER BY state ASC, city ASC').all();
  res.json({ success: true, cities });
});

app.post('/api/city-coverage/check', (req, res) => {
  const { pincode, city } = req.body;
  let match = null;
  if (pincode) {
    const prefix = String(pincode).substring(0, 3);
    match = db.prepare('SELECT * FROM city_coverage WHERE pincode_prefix = ?').get(prefix);
  }
  if (!match && city) {
    match = db.prepare('SELECT * FROM city_coverage WHERE LOWER(city) LIKE LOWER(?)').get(`%${city}%`);
  }

  if (match && match.status === 'Active') {
    res.json({
      success: true,
      isAvailable: true,
      city: match.city,
      state: match.state,
      coachesAvailable: match.coach_count,
      status: 'Active',
      message: `Parametric Play active coaches available in ${match.city}, ${match.state}!`
    });
  } else {
    res.json({
      success: true,
      isAvailable: false,
      city: city || 'Your Location',
      status: match ? match.status : 'Service Not Yet Available',
      message: `Parametric Play has not yet launched verified coaches in this area. You can submit your interest below!`
    });
  }
});

/* ==========================================================================
   11. NOTIFICATIONS
   ========================================================================== */
app.get('/api/notifications', (req, res) => {
  const notifs = db.prepare('SELECT * FROM notifications ORDER BY id DESC LIMIT 50').all();
  res.json({ success: true, notifications: notifs });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
  res.json({ success: true });
});

// Fallback to client SPA (compatible with Express 4 & 5)
app.use((req, res) => {
  const indexHtml = path.join(__dirname, '../../client/dist/index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.json({ message: 'Parametric Play API Server Active. Please run frontend client.' });
  }
});

/* ==========================================================================
   12. SERVER START
   ========================================================================== */
app.listen(PORT, () => {
  console.log(`Parametric Play Fullstack Server listening on http://localhost:${PORT}`);
});
