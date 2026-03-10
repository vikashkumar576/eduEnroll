"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Loader2 } from "lucide-react";
import { enroll } from "@/services/enrollment.service";
import { Course, RazorpayOrder, ApiError } from "@/types";
import PaymentButton from "./PaymentButton";
import toast from "react-hot-toast";

// ──────────────────────────────────────────────
// Zod Schema
// ──────────────────────────────────────────────
const enrollmentSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Please enter a valid name"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(120, "Email is too long"),
  phone: z
    .string()
    .regex(
      /^[+]?[0-9\s\-()]{7,15}$/,
      "Please enter a valid phone number"
    ),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
interface EnrollmentFormProps {
  course: Course;
}

export default function EnrollmentForm({ course }: EnrollmentFormProps) {
  const [razorpayOrder, setRazorpayOrder] = useState<RazorpayOrder | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    try {
      const order = await enroll({
        ...data,
        courseId: course.id,
      });
      setRazorpayOrder(order);
      toast.success("Details saved! Complete payment to confirm enrollment.");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to initiate enrollment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formData = getValues();

  return (
    <div className="w-full max-w-md mx-auto">
      {!razorpayOrder ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Enrollment form"
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
                {...register("name")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.name
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white hover:border-violet-300"
                }`}
              />
            </div>
            {errors.name && (
              <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white hover:border-violet-300"
                }`}
              />
            </div>
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                aria-describedby={errors.phone ? "phone-error" : undefined}
                aria-invalid={!!errors.phone}
                {...register("phone")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.phone
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white hover:border-violet-300"
                }`}
              />
            </div>
            {errors.phone && (
              <p id="phone-error" role="alert" className="mt-1.5 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            aria-busy={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </form>
      ) : (
        /* Step 2 – Payment */
        <div className="space-y-4">
          <div className="rounded-xl bg-violet-50 border border-violet-100 p-4 text-sm text-violet-800">
            <p className="font-semibold mb-1">✅ Details confirmed!</p>
            <p>Click below to complete your payment securely via Razorpay.</p>
          </div>
          <PaymentButton
            order={razorpayOrder}
            customerName={formData.name}
            customerEmail={formData.email}
            customerPhone={formData.phone}
          />
          <button
            onClick={() => setRazorpayOrder(null)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
          >
            ← Edit my details
          </button>
        </div>
      )}
    </div>
  );
}
