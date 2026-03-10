// ──────────────────────────────────────────────
// Domain Types
// ──────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  thumbnail?: string;
  category?: string;
  instructor?: string;
  rating?: number;
  studentsEnrolled?: number;
}

export interface EnrollmentPayload {
  name: string;
  email: string;
  phone: string;
  courseId: string;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;       // in paise
  currency: string;
  keyId: string;
  enrollmentId: string;
  courseName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentVerifyPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  enrollmentId: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  message?: string;
}

// ──────────────────────────────────────────────
// API Utilities
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// ──────────────────────────────────────────────
// Razorpay Global Type Augmentation
// ──────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: () => void): void;
}
