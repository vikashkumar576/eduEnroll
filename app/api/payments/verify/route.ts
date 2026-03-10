import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongoose";
import { Enrollment } from "@/models/Enrollment";
import { sendSuccessEmail, sendFailureEmail } from "@/lib/email";

// ──────────────────────────────────────────────
// POST /api/payments/verify
// Body: { razorpay_payment_id, razorpay_order_id, razorpay_signature, enrollmentId }
// ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      enrollmentId,
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !enrollmentId) {
      return NextResponse.json(
        { success: false, message: "Missing required payment fields." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET not set.");
      return NextResponse.json(
        { success: false, message: "Payment gateway not configured." },
        { status: 500 }
      );
    }

    // ─── Connect DB ─────────────────────────────────────────────────────────
    await connectDB();

    // ─── Fetch enrollment from DB ────────────────────────────────────────────
    const enrollment = await Enrollment.findOne({ enrollmentId });
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found." },
        { status: 404 }
      );
    }

    // ─── Verify Razorpay HMAC signature ─────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // ── Mark as FAILED in DB ───────────────────────────────────────────────
      enrollment.status        = "FAILED";
      enrollment.failureReason = "Signature verification failed.";
      await enrollment.save();

      // ── Send failure email (non-blocking) ──────────────────────────────────
      sendFailureEmail(enrollment).catch((e) =>
        console.error("[email] Failed to send failure email:", e)
      );

      return NextResponse.json(
        { success: false, message: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // ─── Mark as PAID in DB ──────────────────────────────────────────────────
    enrollment.status             = "PAID";
    enrollment.razorpayPaymentId  = razorpay_payment_id;
    enrollment.razorpaySignature  = razorpay_signature;
    enrollment.paidAt             = new Date();
    await enrollment.save();

    // ─── Send success invoice email (non-blocking) ───────────────────────────
    sendSuccessEmail(enrollment).catch((e) =>
      console.error("[email] Failed to send success email:", e)
    );

    return NextResponse.json({
      success: true,
      data: { success: true, message: "Payment verified successfully." },
    });
  } catch (err: unknown) {
    console.error("[/api/payments/verify] error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to verify payment.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// POST /api/payments/failure  (called by frontend on Razorpay dismiss/failure)
// Body: { enrollmentId, reason? }
// ──────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { enrollmentId, reason } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, message: "enrollmentId is required." },
        { status: 400 }
      );
    }

    await connectDB();
    const enrollment = await Enrollment.findOne({ enrollmentId });
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found." },
        { status: 404 }
      );
    }

    // Only mark FAILED if still PENDING (don't overwrite a successful payment)
    if (enrollment.status === "PENDING") {
      enrollment.status        = "FAILED";
      enrollment.failureReason = reason || "Payment cancelled or failed.";
      await enrollment.save();

      sendFailureEmail(enrollment).catch((e) =>
        console.error("[email] Failed to send failure email:", e)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[/api/payments/verify PUT] error:", err);
    return NextResponse.json({ success: false, message: "Internal error." }, { status: 500 });
  }
}
