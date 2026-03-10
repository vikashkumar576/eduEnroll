"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { verifyPayment } from "@/services/enrollment.service";
import { RazorpayOrder, ApiError } from "@/types";
import { paiseToRupees } from "@/lib/utils";
import toast from "react-hot-toast";
import api from "@/services/api";

interface PaymentButtonProps {
  order: RazorpayOrder;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function PaymentButton({
  order,
  customerName,
  customerEmail,
  customerPhone,
}: PaymentButtonProps) {
  const router = useRouter();
  const { loading, openCheckout } = useRazorpay();
  const [verifying, setVerifying] = useState(false);

  const handlePayment = async () => {
    await openCheckout({
      key: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
      amount: order.amount,        // already in paise from backend
      currency: order.currency,
      name: order.courseName,
      description: `Enrollment – ${order.courseName}`,
      order_id: order.orderId,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      theme: {
        color: "#7c3aed", // violet-600
      },
      handler: async (response) => {
        setVerifying(true);
        try {
          const result = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            enrollmentId: order.enrollmentId,
          });

          if (result.success) {
            toast.success("Payment verified! Redirecting…");
            router.push(
              `/success?paymentId=${encodeURIComponent(
                response.razorpay_payment_id
              )}&course=${encodeURIComponent(order.courseName)}`
            );
          } else {
            throw new Error("Payment verification failed.");
          }
        } catch (err) {
          const apiErr = err as ApiError;
          toast.error(apiErr.message || "Payment verification failed.");
          router.push(
            `/error?orderId=${encodeURIComponent(order.orderId)}`
          );
        } finally {
          setVerifying(false);
        }
      },
      modal: {
        ondismiss: async () => {
          toast("Payment cancelled. You can retry anytime.", { icon: "ℹ️" });
          // Notify backend so enrollment is marked FAILED and failure email is sent
          try {
            await api.put("/api/payments/verify", {
              enrollmentId: order.enrollmentId,
              reason: "Payment cancelled by user.",
            });
          } catch {
            // Non-critical — swallow silently
          }
        },
      },
    });
  };

  const isLoading = loading || verifying;

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label="Pay with Razorpay"
      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-violet-300 disabled:to-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 shadow-lg shadow-violet-200"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {verifying ? "Verifying payment…" : "Loading payment…"}
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          Pay {order.currency}{" "}
          {paiseToRupees(order.amount).toLocaleString("en-IN")}
        </>
      )}
    </button>
  );
}
