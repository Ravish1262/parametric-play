# PARAMETRIC PLAY

> **"Professional Sports Coaching. One Platform. Three Solutions."**

Parametric Play is a production-oriented, full-stack sports technology and athletic business management application designed for Pan-India operations. It seamlessly unifies three distinct sports coaching business models with company-managed coaches, role-based access control, QR-based payment workflows, and financial ledgers.

---

## 🌟 The Three Integrated Business Models

### 1. School Sports Management
- **Eligibility Threshold:** Minimum student strength requirement of **800 students**. Schools with < 800 students are flagged for manual review and do not receive automatic standard approval.
- **Proposed Staffing Ratio Formula:**
  $$\text{Required Coaches} = \left\lceil \frac{\text{Total Students}}{400} \right\rceil$$
  *(1 PTI / Sports Coach for every 400 students, rounded upward).* Clearly labelled as Parametric Play's proposed business staffing model rather than a statutory mandate.
- **Curriculum:** Standard coverage for **Classes 1 through 8**, integrating across **Periods 1 through 8** of the school timetable.
- **Contractual Condition:** Standard agreements include sports day and event direction, but **strictly exclude financing school events**. Any event funding is contracted separately in writing.
- **Proposal Generator:** Generates professional, downloadable, and printable PDF proposals with comparative assessments, curriculum schedules, and configurable pricing.

### 2. Residential Society Sports & Fitness Coaching
- **Minimum Batch Threshold:** Minimum of **10 participating children** required to launch a coaching batch. Programmes with < 10 children are marked as *"Minimum Enrolment Pending"* and are not charged.
- **Standard Monthly Fee:** **₹2,000 per child per month** ($10 \text{ children} \times ₹2,000 = ₹20,000\text{ gross monthly revenue}$).
- **Session Durations:** 1-hour sessions, 2-hour intensive sessions, or custom durations.
- **Disciplines:** Sports-specific coaching (Football, Cricket, Basketball, Badminton, Martial Arts) or a General Kids Fitness Programme (agility, motor coordination, teamwork).
- **Equipment Logistics:** Company-supplied sports equipment kits tracked and assigned per batch.

### 3. Personal Training (Home Visit & Live Online)
- **10 Disciplines:** Aerobics, Yoga, Fitness Training, Gym Training, Strength & Conditioning, Karate, Judo, Taekwondo, Boxing, Martial Arts.
- **Standard Monthly Package:** **₹2,000 per client per month**.
- **Transparent Revenue Split:**
  - **Coach Allocation:** **₹1,000** per paid client-month.
  - **Parametric Play Gross Share:** **₹1,000** before operating overhead, equipment, taxes, and transaction fees.
- **Service Modes:**
  - **Home Visit Training:** Verified coach travels to customer's residence (address is encrypted and private; never disclosed publicly).
  - **Online Live Training:** Interactive 1-on-1 coaching via dedicated meeting room links.
- **Collision Prevention:** Automated scheduling engine blocks double-bookings and overlapping slots for any coach.

---

## 👥 Five User Roles & Demo Personas

The application features built-in Role-Based Access Control (RBAC) and a **one-click Persona Switcher Bar** for instant evaluation:

| Role | Demo Account | Default Credentials | Permissions & Features |
|---|---|---|---|
| **Super Administrator** | `admin@parametricplay.com` | `admin123` | Complete control over users, coach verification, school proposals, society batches, bookings, UPI reconciliation, equipment inventory, financial ledgers, and system settings. |
| **Coach** | `coach.rajesh@parametricplay.com` | `coach123` | View assigned clients, timetable, session updates, monthly earnings (₹1,000/client), and upload certificates/ID proofs. |
| **School Administrator** | `principal@xavierschool.edu` | `school123` | Submit school enquiry, test 800-student minimum eligibility, review proposed staffing ratio, inspect Classes 1-8 curriculum, and print PDF proposal. |
| **Society Manager** | `manager@palmgreens.in` | `society123` | Register society batches, verify 10-kid threshold, view assigned coach, schedule, and equipment kit. |
| **Customer / Parent** | `parent.amit@gmail.com` | `customer123` | Book personal training, choose Home/Online mode, scan UPI QR, submit UTR reference, join live video rooms, and track booking status. |

---

## 💳 QR Code & Payment Verification Architecture

### Official Payment QR & UPI Deep-Linking
- **UPI VPA:** `parametricplay@upi`
- **Scannable QR:** High-resolution dynamic QR code generated using client-side SVG/PNG canvas, compatible with Google Pay, PhonePe, Paytm, and BHIM.
- **Anti-Fraud Security Policy:** The platform **never marks a payment as successful solely because a user clicked a button or uploaded a screenshot**.
- **Workflow:**
  1. Customer generates booking (`PP-BK-XXXX`) with status `Awaiting Payment`.
  2. Customer scans QR code or enters UPI ID, completes transfer, and submits their **12-digit UTR Transaction Reference**.
  3. Status transitions to `Payment Pending Verification`.
  4. Super Administrator audits bank statement in the Admin Dashboard and clicks **"Verify & Confirm"**.
  5. Status updates to `Confirmed`, coach earnings are credited (₹1,000), financial ledger records inflow, and meeting room link is issued for online sessions.

### Gateway Integration Ready (Razorpay)
When merchant credentials are provided, Razorpay Checkout and webhook verification can be activated via environment variables (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).

---

## 🛠 Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, QRCode, Vite.
- **Backend:** Node.js, Express 5, Better-SQLite3, Multer (multipart uploads), Cors.
- **Database:** SQLite with WAL mode (`server/data/parametric_play.db`) with full schema tables, relational constraints, and seed data.
- **Brand Colors:**
  - Dark Forest Green: `#04130B`, `#072013`, `#0E3621`
  - Lime Green / Emerald Accents: `#22C55E`, `#10B981`, `#A3E635`
  - Clean whites and light greys (`#F8FAFC`, `#F1F5F9`)
- **Typography:** *Plus Jakarta Sans* and *Outfit* (Google Fonts).

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- Node.js v18+ (tested on Node v22.14.0)
- npm v9+

### 2. Setup
```bash
# Clone or navigate to the project directory
cd /Users/ravishpandey/.gemini/antigravity-ide/scratch/parametric-play

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Run Development Servers
```bash
# Option A: Start unified fullstack server (serves API on port 5001 + built client)
npm start

# Option B: Run concurrently in development
# Terminal 1:
npm run dev:server
# Terminal 2:
npm run dev:client
```
The application will be accessible at **`http://localhost:5001`** (or `http://localhost:3000` via Vite dev server proxy).

### 4. Run Functional Test Suite
To verify all 18 acceptance criteria, business formulas, ratios, and UTR workflows:
```bash
node server/tests/functional_test.js
```
Expected output:
```text
=== SUITE COMPLETE: 21 PASSED, 0 FAILED ===
```

---

## 📄 PDF Proposal Generation

The School Sports Proposal module has dedicated CSS print styling (`@media print`):
- Click **"Download Official Proposal PDF"** or **"Proposal PDF"** in the Admin or School Portal.
- The proposal modal opens with comparison matrices, staffing ratio proofs, and contract clauses.
- Click **"Print / Save as PDF"** to export a clean, high-resolution document ready for school boards and principals.

---

## 📞 Default Company Contact Information

Configurable directly from the Administrator Dashboard without code modification:
- **Phone / WhatsApp:** `8102140650`
- **Email:** `playparametric@gmail.com`
- **Company Name:** Parametric Play
- **Headquarters:** New Delhi / Pan-India Service Coverage
