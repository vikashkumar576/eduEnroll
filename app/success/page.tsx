import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, BookOpen, Home, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your enrollment has been confirmed. Start learning now!",
};

interface SuccessPageProps {
  searchParams: Promise<{ paymentId?: string; course?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { paymentId, course } = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated check icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-green-50 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            {course
              ? `You're now enrolled in "${decodeURIComponent(course)}". Welcome aboard!`
              : "Your enrollment has been confirmed. Welcome aboard!"}
          </p>
        </div>

        {/* Payment ID */}
        {paymentId && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-left">
            <p className="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wide">
              Payment Reference
            </p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {decodeURIComponent(paymentId)}
            </p>
          </div>
        )}

        {/* Highlights */}
        <ul className="text-left space-y-3">
          {[
            { icon: BookOpen, text: "Lifetime access to course content" },
            { icon: Download, text: "Certificate upon completion" },
            { icon: CheckCircle2, text: "Confirmation sent to your email" },
          ].map(({ icon: Icon, text }, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-violet-600" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/courses"
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <BookOpen className="w-4 h-4" />
            Browse More Courses
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
