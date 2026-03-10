import api from "./api";
import {
  ApiResponse,
  EnrollmentPayload,
  PaymentVerifyPayload,
  PaymentVerifyResponse,
  RazorpayOrder,
} from "@/types";

/**
 * Enroll a user in a course.
 * Returns Razorpay order details to open checkout.
 */
export async function enroll(
  payload: EnrollmentPayload
): Promise<RazorpayOrder> {
  const response = await api.post<ApiResponse<RazorpayOrder>>(
    "/api/enroll",
    payload
  );
  return response.data.data;
}

/**
 * Verify a Razorpay payment after checkout success.
 */
export async function verifyPayment(
  payload: PaymentVerifyPayload
): Promise<PaymentVerifyResponse> {
  const response = await api.post<ApiResponse<PaymentVerifyResponse>>(
    "/api/payments/verify",
    payload
  );
  return response.data.data;
}
