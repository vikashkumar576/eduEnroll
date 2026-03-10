import mongoose, { Schema, Document, Model } from "mongoose";

// ──────────────────────────────────────────────
// Enrollment Status
// ──────────────────────────────────────────────
export type EnrollmentStatus = "PENDING" | "PAID" | "FAILED";

// ──────────────────────────────────────────────
// TypeScript Interface
// ──────────────────────────────────────────────
export interface IEnrollment extends Document {
  enrollmentId: string;       // Custom ID e.g. enr_abc123
  courseId: string;
  courseName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountPaise: number;        // Amount in paise (Razorpay unit)
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: EnrollmentStatus;
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ──────────────────────────────────────────────
// Schema
// ──────────────────────────────────────────────
const EnrollmentSchema = new Schema<IEnrollment>(
  {
    enrollmentId: { type: String, required: true, unique: true, index: true },
    courseId:     { type: String, required: true, index: true },
    courseName:   { type: String, required: true },
    customerName:  { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true },
    amountPaise:  { type: Number, required: true },
    currency:     { type: String, required: true, default: "INR" },
    razorpayOrderId:   { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status:  { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
    failureReason: { type: String },
    paidAt: { type: Date },
  },
  {
    timestamps: true,   // createdAt + updatedAt
    collection: "enrollments",
  }
);

// ──────────────────────────────────────────────
// Model (guard against Next.js hot-reload re-compilation)
// ──────────────────────────────────────────────
export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
