const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'localhost',
      port: 5001,
      path: path
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== RUNNING PARAMETRIC PLAY FUNCTIONAL ACCEPTANCE SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. School Tests
    console.log('--- 1. SCHOOL SPORTS TESTS ---');
    // 799 students
    const res799 = await post('/api/schools/enquire', {
      schoolName: 'Test School 799',
      phone: '9900112233',
      email: 'test799@school.edu',
      totalStudents: 799
    });
    assert(res799.calculation.meetsMinRequirement === false, 'School with 799 students does NOT qualify for automatic standard approval');
    assert(res799.calculation.proposedCoachCount === 2, 'School with 799 students receives proposed staffing of Ceiling(799/400) = 2 coaches');

    // 800 students
    const res800 = await post('/api/schools/enquire', {
      schoolName: 'Test School 800',
      phone: '9900112244',
      email: 'test800@school.edu',
      totalStudents: 800
    });
    assert(res800.calculation.meetsMinRequirement === true, 'School with 800 students qualifies for standard eligibility');
    assert(res800.calculation.proposedCoachCount === 2, 'School with 800 students receives proposed staffing of Ceiling(800/400) = 2 coaches');

    // 2,000 students
    const res2000 = await post('/api/schools/enquire', {
      schoolName: 'Test School 2000',
      phone: '9900112255',
      email: 'test2000@school.edu',
      totalStudents: 2000
    });
    assert(res2000.calculation.proposedCoachCount === 5, 'School with 2,000 students receives proposed staffing of Ceiling(2000/400) = 5 coaches');

    // 2. Residential Society Tests
    console.log('\n--- 2. RESIDENTIAL SOCIETY TESTS ---');
    // 9 kids (< 10)
    const resSoc9 = await post('/api/societies/register', {
      societyName: 'Silver Palms 9',
      phone: '9811002233',
      email: 'manager@palms9.org',
      childCount: 9,
      selectedProgramme: 'Football'
    });
    assert(resSoc9.calculation.meetsMinEnrolment === false, 'Society with 9 participants remains below standard minimum threshold');
    assert(resSoc9.calculation.status === 'Minimum Enrolment Pending', 'Society with 9 participants marked as "Minimum Enrolment Pending"');

    // 10 kids (>= 10)
    const resSoc10 = await post('/api/societies/register', {
      societyName: 'Golden Heights 10',
      phone: '9811002244',
      email: 'manager@golden10.org',
      childCount: 10,
      selectedProgramme: 'Kids Fitness Programme'
    });
    assert(resSoc10.calculation.meetsMinEnrolment === true, 'Society with 10 participants qualifies for batch launch review');
    assert(resSoc10.calculation.feePerChild === 2000, 'Monthly fee per child defaults to ₹2,000');
    assert(resSoc10.calculation.grossMonthlyFee === 20000, '10 participants at ₹2,000 produces gross monthly fee of ₹20,000');

    // 3. Personal Training Tests
    console.log('\n--- 3. PERSONAL TRAINING & PRICING TESTS ---');
    const settings = await get('/api/settings');
    assert(Number(settings.settings.pt_monthly_price) === 2000, 'Default personal training monthly package is ₹2,000');
    assert(Number(settings.settings.pt_coach_share) === 1000, 'Proposed coach allocation is ₹1,000');
    assert(Number(settings.settings.pt_company_share) === 1000, 'Proposed company share before expenses is ₹1,000');

    // Create Booking
    const newBooking = await post('/api/bookings', {
      customerName: 'Rohit Khandelwal',
      customerPhone: '9899001122',
      customerEmail: 'rohit@test.com',
      serviceType: 'Personal Training Home',
      categoryName: 'Martial Arts',
      trainingMode: 'Home Visit',
      address: 'Flat 101, Test Tower',
      city: 'New Delhi',
      pincode: '110001'
    });
    assert(newBooking.success === true, 'New personal training booking created');
    assert(newBooking.monthlyPrice === 2000, 'Booking price is ₹2,000');
    assert(newBooking.coachAllocation === 1000, 'Coach allocation is ₹1,000');
    assert(newBooking.companyShare === 1000, 'Company share is ₹1,000');

    // Submit UTR
    const utrSubmission = await new Promise((resolve) => {
      const payload = JSON.stringify({ utrTransactionRef: 'UPI492019482019' });
      const req = http.request({
        hostname: 'localhost',
        port: 5001,
        path: `/api/bookings/${newBooking.bookingId}/submit-payment`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let b = '';
        res.on('data', chunk => b += chunk);
        res.on('end', () => resolve(JSON.parse(b)));
      });
      req.write(payload);
      req.end();
    });
    assert(utrSubmission.success === true, 'Payment UTR reference submitted');

    // Verify booking is NOT immediately confirmed until admin acts
    const checkBooking = await get(`/api/bookings?role=admin`);
    const myBooking = checkBooking.bookings.find(b => b.id === newBooking.bookingId);
    assert(myBooking.status === 'Payment Pending Verification', 'Booking is NOT automatically marked as Confirmed without Admin verification');

    // 4. City Coverage Tests
    console.log('\n--- 4. PAN-INDIA CITY COVERAGE TESTS ---');
    const delhiCheck = await post('/api/city-coverage/check', { pincode: '110001', city: 'New Delhi' });
    assert(delhiCheck.isAvailable === true, 'Delhi NCR has active verified coach network');

    const indoreCheck = await post('/api/city-coverage/check', { pincode: '452001', city: 'Indore' });
    assert(indoreCheck.isAvailable === false, 'Unserviced cities are marked as not yet active / waitlist without inventing fake coaches');

    console.log(`\n=== SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
