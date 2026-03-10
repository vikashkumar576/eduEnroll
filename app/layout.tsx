import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EduEnroll – Online Courses & Enrollment",
    template: "%s | EduEnroll",
  },
  description:
    "Discover top-rated courses and enroll instantly with secure Razorpay payment. Level up your skills today.",
  keywords: ["online courses", "enrollment", "e-learning", "education"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "EduEnroll",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* ─── Navigation ─── */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <nav
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
            aria-label="Main navigation"
          >
            <Link
              href="/courses"
              className="flex items-center gap-2 text-violet-700 font-bold text-xl hover:text-violet-900 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg"
              aria-label="EduEnroll home"
            >
              <GraduationCap className="w-7 h-7" />
              EduEnroll
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/courses"
                className="text-sm font-medium text-gray-600 hover:text-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
              >
                Courses
              </Link>
              <Link
                href="/courses"
                className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Enroll Now
              </Link>
            </div>
          </nav>
        </header>

        {/* ─── Page Content ─── */}
        <main className="flex-1">{children}</main>

        {/* ─── Footer ─── */}
        <footer className="bg-white border-t border-gray-100 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} EduEnroll. All rights reserved.
            </p>
          </div>
        </footer>

        {/* ─── Toast Notifications ─── */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e1b4b",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#a78bfa", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
