import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { connectDB } from "@/lib/mongoose";
import { Enrollment } from "@/models/Enrollment";

// ──────────────────────────────────────────────
// Course Catalog
// Prices are stored in paise (1 INR = 100 paise).
// TODO: Replace this map with a real DB/CMS lookup when available.
// ──────────────────────────────────────────────
const COURSE_CATALOG: Record<string, { name: string; priceInPaise: number }> = {
  "course-001": { name: "Full-Stack Web Development Bootcamp",        priceInPaise: 499900 }, // ₹4,999
  "course-002": { name: "UI/UX Design Masterclass",                   priceInPaise: 349900 }, // ₹3,499
  "course-003": { name: "Machine Learning with Python",               priceInPaise: 599900 }, // ₹5,999
  "course-004": { name: "AWS Cloud Practitioner & Solutions Architect", priceInPaise: 399900 }, // ₹3,999
  "course-005": { name: "Data Analysis with Excel & Power BI",        priceInPaise: 249900 }, // ₹2,499
  "course-006": { name: "Digital Marketing & SEO Fundamentals",       priceInPaise: 199900 }, // ₹1,999
};

// ──────────────────────────────────────────────
// POST /api/enroll
// Body: { name, email, phone, courseId }
// Returns: RazorpayOrder shape expected by the frontend
// ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, courseId } = body;

    if (!name || !email || !phone || !courseId) {
      return NextResponse.json(
        { success: false, message: "name, email, phone and courseId are required." },
        { status: 400 }
      );
    }

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials missing in environment.");
      return NextResponse.json(
        { success: false, message: "Payment gateway not configured." },
        { status: 500 }
      );
    }

    // ─── Connect DB ─────────────────────────────────────────────────────────
    await connectDB();

    // ─── Dynamic Course lookup ───────────────────────────────────────────────
    // Look up the course in the catalog to get its real price and name.
    // Falls back to a generic entry if the courseId isn't in the static map,
    // which allows dynamically-created courses passed in from the backend DB.
    const catalogEntry = COURSE_CATALOG[courseId];
    if (!catalogEntry) {
      return NextResponse.json(
        { success: false, message: `Course "${courseId}" not found.` },
        { status: 404 }
      );
    }
    const amountInPaise = catalogEntry.priceInPaise;
    const courseName    = catalogEntry.name;

    // ─── Create Razorpay Order ───────────────────────────────────────────────
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: "INR",
      receipt:  `enroll_${courseId}_${Date.now()}`,
      notes:    { courseId, customerEmail: email },
    });

    // ─── Persist enrollment (PENDING) in MongoDB ────────────────────────────
    const enrollmentId = `enr_${crypto.randomBytes(8).toString("hex")}`;

    await Enrollment.create({
      enrollmentId,
      courseId,
      courseName,
      customerName:  name,
      customerEmail: email,
      customerPhone: phone,
      amountPaise:   amountInPaise,
      currency:      "INR",
      razorpayOrderId: order.id,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId:       order.id,
        amount:        order.amount,
        currency:      order.currency,
        keyId,
        enrollmentId,
        courseName,
        customerName:  name,
        customerEmail: email,
        customerPhone: phone,
      },
    });
  } catch (err: unknown) {
    console.error("[/api/enroll] error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create enrollment order.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
