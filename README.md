# 🎓 EduEnroll — Course Enrollment System

> **Full-stack Next.js 16** course enrollment platform with Razorpay payment integration, MongoDB persistence, and automated email notifications.

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Full-stack React framework — SSR, API Routes |
| **Language** | TypeScript | End-to-end type safety |
| **Styling** | TailwindCSS v4 | Utility-first responsive styling |
| **Forms** | React Hook Form + Zod | Performant form state + schema validation |
| **HTTP Client** | Axios | API calls with request/response interceptors |
| **Payments** | [Razorpay](https://razorpay.com/) (SDK + Checkout.js) | Payment order creation & HMAC verification |
| **Database** | MongoDB + Mongoose | Enrollment persistence |
| **Email** | Nodemailer (SMTP) | Confirmation & failure email notifications |
| **Notifications** | react-hot-toast | In-app toast feedback |
| **Icons** | lucide-react | Icon library |

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│                                                              │
│  /courses          /enroll/[courseId]     /success  /error   │
│  CourseCard        EnrollmentForm         Result pages        │
│  useCourses()      PaymentButton                             │
│                    useRazorpay()                             │
└──────────────────────┬───────────────────────────────────────┘
                       │ Axios (services/)
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    Next.js API Routes                         │
│                                                              │
│  POST /api/enroll          POST /api/payments/verify         │
│  ├─ Validate input         ├─ Validate input                 │
│  ├─ Lookup COURSE_CATALOG  ├─ HMAC signature check           │
│  ├─ Create Razorpay order  ├─ Update enrollment → PAID       │
│  └─ Save PENDING in DB     └─ Send success/failure email     │
│                                                              │
│  PUT /api/payments/verify                                    │
│  └─ Mark PENDING → FAILED on user cancel                     │
└──────────────────────┬───────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
┌─────────▼─────────┐   ┌──────────▼──────────┐
│  MongoDB Atlas /   │   │  Razorpay API        │
│  Local MongoDB     │   │  (orders, verify)    │
│  (Enrollments)     │   └─────────────────────┘
└────────────────────┘
          │
┌─────────▼─────────┐
│  SMTP (Nodemailer) │
│  Gmail / Brevo /   │
│  any SMTP provider │
└────────────────────┘
```

---

## 📁 Project Structure

```
edu-enroll/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (Navbar, Toaster, fonts)
│   ├── page.tsx                      # Root → redirects to /courses
│   ├── globals.css                   # Global styles + Tailwind imports
│   │
│   ├── courses/
│   │   └── page.tsx                  # Course listing grid  [GET courses]
│   ├── enroll/[courseId]/
│   │   └── page.tsx                  # Enrollment + payment page
│   ├── success/
│   │   └── page.tsx                  # Payment success confirmation
│   ├── error/
│   │   └── page.tsx                  # Payment failure + retry
│   │
│   └── api/                          # Next.js Route Handlers (server-side)
│       ├── enroll/
│       │   └── route.ts              # POST /api/enroll
│       └── payments/
│           └── verify/
│               └── route.ts          # POST /api/payments/verify
│                                     # PUT  /api/payments/verify (failure)
│
├── components/
│   ├── CourseCard.tsx                # Course display card with Enroll button
│   ├── CourseCardSkeleton.tsx        # Loading skeleton placeholder
│   ├── EnrollmentForm.tsx            # RHF + Zod validated form
│   └── PaymentButton.tsx             # Razorpay checkout trigger + verify
│
├── hooks/
│   ├── useRazorpay.ts                # Loads checkout.js + opens Razorpay modal
│   └── useCourses.ts                 # Fetches & caches the courses list
│
├── services/
│   ├── api.ts                        # Axios instance + request/response interceptors
│   ├── courses.service.ts            # getCourses(), getCourse(id)
│   └── enrollment.service.ts         # enroll(), verifyPayment()
│
├── models/
│   └── Enrollment.ts                 # Mongoose schema & model (IEnrollment)
│
├── lib/
│   ├── mongoose.ts                   # MongoDB connection with global hot-reload cache
│   ├── email.ts                      # Nodemailer transporter + HTML email builders
│   └── utils.ts                      # formatCurrency(), loadRazorpayScript(), etc.
│
├── types/
│   └── index.ts                      # Shared TypeScript types + Razorpay globals
│
├── .env.local.example                # Environment variable template
├── next.config.ts                    # Next.js config
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

---

## 📦 Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | `>= 20.x` (tested on v24.14.0) |
| **npm** | `>= 9.x` |
| **MongoDB** | Local instance or [MongoDB Atlas](https://cloud.mongodb.com) free cluster |
| **Razorpay account** | [Sign up free](https://dashboard.razorpay.com/signup) — get test API keys |
| **SMTP credentials** | Gmail App Password, Brevo, Zoho, Mailgun SMTP, etc. |

---

## ⚙️ Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```env
# ── Razorpay ──────────────────────────────────────────────────
# Public key (safe to expose in browser via NEXT_PUBLIC_)
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx

# Server-side keys — NEVER expose these to the browser
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# ── App ───────────────────────────────────────────────────────
# Base URL of this Next.js app (used by API routes + email links)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ── MongoDB ───────────────────────────────────────────────────
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/edu-enroll?retryWrites=true&w=majority
# OR MongoDB Atlas cluster URI
# MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/edu-enroll

# ── SMTP / Email ──────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password     # Use App Password, not your account password
SMTP_FROM=Viku Academy <your-email@gmail.com>
```

---

## 📥 Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/edu-enroll.git
cd edu-enroll

# 2. Install all dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your actual keys (see Environment Variables section above)
```

---

## 🧑‍💻 Running Locally

```bash
# Start the development server (with hot-reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The first request to an API route will establish the MongoDB connection. Subsequent requests reuse the cached connection.

### Other Commands

```bash
# Build for production
npm run build

# Start the production server (requires a prior build)
npm run start

# Run TypeScript type checker (no emit)
npx tsc --noEmit

# Lint the codebase
npm run lint
```

---

## 🔌 API Reference

All API routes are **Next.js Route Handlers** running server-side (no separate backend needed).

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/enroll` | Validate input → lookup course price → create Razorpay order → save PENDING enrollment in MongoDB |
| `POST` | `/api/payments/verify` | Verify Razorpay HMAC signature → mark enrollment PAID → send success email |
| `PUT` | `/api/payments/verify` | Mark a PENDING enrollment as FAILED on payment cancel/dismiss → send failure email |

### `POST /api/enroll` — Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "courseId": "course-001"
}
```

### `POST /api/enroll` — Response

```json
{
  "success": true,
  "data": {
    "orderId": "order_xxxxxxxxxxxx",
    "amount": 499900,
    "currency": "INR",
    "keyId": "rzp_test_xxxxxxxxxxxx",
    "enrollmentId": "enr_xxxxxxxxxxxx",
    "courseName": "Full-Stack Web Development Bootcamp",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+91 98765 43210"
  }
}
```

> **Note:** `amount` is in **paise** (1 INR = 100 paise) as required by Razorpay.

### `POST /api/payments/verify` — Request

```json
{
  "razorpay_payment_id": "pay_xxxxxxxxxxxx",
  "razorpay_order_id": "order_xxxxxxxxxxxx",
  "razorpay_signature": "hmac_sha256_hex_string",
  "enrollmentId": "enr_xxxxxxxxxxxx"
}
```

---

## 💳 Payment Flow

```
User fills EnrollmentForm
        │
        ▼
POST /api/enroll
  ├─ Lookup course price from COURSE_CATALOG
  ├─ Create Razorpay order (server-side)
  └─ Save enrollment { status: PENDING } in MongoDB
        │
        ▼
Razorpay Checkout modal opens in browser
        │
   ┌────┴────┐
   │         │
  PAID     FAILED/CANCELLED
   │         │
   ▼         ▼
POST         PUT
/api/payments/verify
   │         │
   ▼         ▼
Mark PAID  Mark FAILED
Send ✅      |
   │         │
   ▼         ▼
/success   /error
```

---

## 🛒 How to Enroll in a Course (Step-by-Step)

### Step 1 — Browse the Course Catalogue

1. Open the app at [http://localhost:3000](http://localhost:3000).
2. You are automatically redirected to the **Courses** page (`/courses`).
3. Browse the available courses — each card displays:
   - Course title, category, and instructor
   - Star rating and duration
   - Course-specific price (fetched dynamically)

### Step 2 — Select a Course

1. Find the course you want.
2. Click the **"Enroll Now"** button on its card.
3. You are taken to the **Enrollment page** at `/enroll/<courseId>`.

### Step 3 — Fill in Your Details

The enrollment page has two columns:

| Left Column | Right Column |
|---|---|
| Course summary card (title, instructor, rating, duration) | Enrollment form |
| Dynamic price card (exact per-course price) | |

Fill in the required fields in the form:

| Field | Format | Example |
|---|---|---|
| **Full Name** | Any name | `John Doe` |
| **Email Address** | Valid email | `john@example.com` |
| **Phone Number** | With country code | `+91 98765 43210` |

> ⚠️ All fields are validated in real time using **Zod**. The **"Proceed to Payment"** button remains disabled until the form is fully valid.

### Step 4 — Initiate Payment

1. Click **"Proceed to Payment"**.
2. The frontend sends `POST /api/enroll` with your details and `courseId`.
3. The server:
   - Looks up the **course-specific price** from the catalog.
   - Creates a **Razorpay order** for exactly that amount.
   - Saves an **enrollment record** (`status: PENDING`) in MongoDB.
4. A toast notification confirms the order was created.

### Step 5 — Complete Payment in Razorpay Checkout

1. The **Razorpay checkout modal** opens automatically in your browser.
2. Choose your preferred payment method:
   - 💳 Credit / Debit Card
   - 🏦 Net Banking
   - 📱 UPI (Google Pay, PhonePe, Paytm, etc.)
   - 💼 Wallets
3. Complete the payment inside the modal.

> 🔐 All payments are processed securely by Razorpay. Your card or account details are **never** stored on our servers.

### Step 6 — Payment Verification (Automatic)

After the Razorpay modal reports success:

1. Razorpay returns `payment_id`, `order_id`, and `signature` to the frontend.
2. The app calls `POST /api/payments/verify`.
3. The server validates the **HMAC-SHA256 signature** server-side.
4. The enrollment record in MongoDB is updated to `status: PAID`.
5. A **confirmation email** (with payment receipt/invoice) is sent to your email address.

### Step 7 — Confirmation

| Outcome | Result |
|---|---|
| ✅ **Payment successful** | Redirected to `/success` with your Payment ID and course name. Confirmation email sent. |
| ❌ **Payment failed / cancelled** | Redirected to `/error`. Enrollment marked `FAILED`. Failure notification email sent. |

### Step 8 — Retrying a Failed Payment

1. On the `/error` page, click **"Try Again"**.
2. You are redirected back to `/enroll/<courseId>`.
3. Fill in your details again and repeat from **Step 3**.

> **Dynamic pricing:** The amount charged is fetched live from the course catalog — every course has its own price. The price on the course card, the enrollment page, and the Razorpay checkout modal will always match.

---

## 📧 Email Notifications

The system sends transactional emails via **Nodemailer** (SMTP). Configure credentials in `.env.local` — works with Gmail (App Password), Brevo, Zoho, Mailgun SMTP, or any SMTP provider.

### ✅ Success Email

| Trigger | How |
|---|---|
| Payment verified | `POST /api/payments/verify` → `sendSuccessEmail()` called server-side |

Sends an HTML invoice/receipt containing: Enrollment ID, Payment ID, Order ID, course name, amount paid, and timestamp.

### ❌ Failure Email

| Trigger | Status | Details |
|---|---|---|
| User **dismisses** the Razorpay modal (clicks ✕) | ✅ Works | `ondismiss` callback in `PaymentButton.tsx` calls `PUT /api/payments/verify` → marks PENDING → FAILED → sends failure email |
| Signature **mismatch** on verify | ✅ Works | `POST /api/payments/verify` marks FAILED and calls `sendFailureEmail()` |
| Genuine payment **failure** (card declined, OTP timeout, bank error, insufficient funds) | ⚠️ **Not triggered** | The `payment.failed` event listener in `useRazorpay.ts` is registered but its handler body is **empty** — it does not call `PUT /api/payments/verify`, so the enrollment stays `PENDING` and **no failure email is sent** |

> **Known limitation:** When a payment fails inside the Razorpay modal (as opposed to the user manually closing it), the failure email is **not sent**. To fix this, the `payment.failed` handler in `hooks/useRazorpay.ts` (line 37) must be wired up to call `PUT /api/payments/verify` with the `enrollmentId` and failure reason.

---

## 🎓 Course Catalog

The following courses are pre-loaded in the system:

| Course ID | Course Name | Price |
|---|---|---|
| `course-001` | Full-Stack Web Development Bootcamp | ₹4,999 |
| `course-002` | UI/UX Design Masterclass | ₹3,499 |
| `course-003` | Machine Learning with Python | ₹5,999 |
| `course-004` | AWS Cloud Practitioner & Solutions Architect | ₹3,999 |
| `course-005` | Data Analysis with Excel & Power BI | ₹2,499 |
| `course-006` | Digital Marketing & SEO Fundamentals | ₹1,999 |

> Prices are stored in paise in `COURSE_CATALOG` inside `app/api/enroll/route.ts`. Update this map (or replace it with a DB lookup) to change prices or add new courses.

---

## 🗄️ Database Schema

The `enrollments` MongoDB collection stores one document per enrollment attempt:

| Field | Type | Description |
|---|---|---|
| `enrollmentId` | `String` | Unique ID (e.g., `enr_abc123ef`) |
| `courseId` | `String` | Course identifier |
| `courseName` | `String` | Human-readable course title |
| `customerName` | `String` | Student full name |
| `customerEmail` | `String` | Student email (lowercase) |
| `customerPhone` | `String` | Student phone number |
| `amountPaise` | `Number` | Amount in paise (÷100 = INR) |
| `currency` | `String` | Always `"INR"` |
| `razorpayOrderId` | `String` | Razorpay order ID |
| `razorpayPaymentId` | `String?` | Set after successful payment |
| `razorpaySignature` | `String?` | HMAC signature (after verify) |
| `status` | `PENDING \| PAID \| FAILED` | Payment lifecycle state |
| `failureReason` | `String?` | Set on failure |
| `paidAt` | `Date?` | Timestamp of successful payment |
| `createdAt` | `Date` | Auto (via Mongoose timestamps) |
| `updatedAt` | `Date` | Auto (via Mongoose timestamps) |

---

## 🎨 UI Features

- ✅ Responsive grid layout (mobile → tablet → desktop)
- ✅ Skeleton loading states while courses are fetching
- ✅ Real-time Zod-powered form validation with inline error messages
- ✅ Disabled submit button while form is invalid or request is in-flight
- ✅ Toast notifications for success/error states
- ✅ Accessible UI (ARIA labels, `role="alert"`, focus management)
- ✅ Mock data fallback when backend is unavailable (dev-friendly)

---

## 🔐 Security Notes

- Payment **signature verification is server-side only** (`/api/payments/verify`)
- The `RAZORPAY_KEY_SECRET` is never sent to or accessible by the browser
- `NEXT_PUBLIC_` variables are the only ones intentionally exposed client-side
- MongoDB connection uses a **global cache** to prevent hot-reload connection storms

---

## 📄 License

MIT © EduEnroll / Viku Academy
