import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, RefreshCw, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Failed",
  description: "Something went wrong with your payment. Please try again.",
};

interface ErrorPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-red-50 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            We couldn&apos;t process your payment. No money has been deducted from
            your account.
          </p>
        </div>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-left">
            <p className="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wide">
              Order Reference
            </p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {decodeURIComponent(orderId)}
            </p>
          </div>
        )}

        {/* Possible reasons */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left">
          <p className="text-sm font-semibold text-amber-800 mb-2">
            Common reasons for failure:
          </p>
          <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
            <li>Insufficient balance</li>
            <li>Card expired or blocked</li>
            <li>Internet connection interrupted</li>
            <li>Bank declined the transaction</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/courses"
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>
          <Link
            href="/courses"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <BookOpen className="w-4 h-4" />
            Browse Courses
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          Need help?{" "}
          <a
            href="mailto:support@eduenroll.in"
            className="text-violet-600 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
