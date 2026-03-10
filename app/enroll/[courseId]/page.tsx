import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Shield, Star } from "lucide-react";
import EnrollmentForm from "@/components/EnrollmentForm";
import { getCourse } from "@/services/courses.service";
import { formatCurrency } from "@/lib/utils";
import { Course } from "@/types";

// ── Mock course fallback for dev (matches MOCK_COURSES in courses page) ────
const MOCK_COURSE_MAP: Record<string, Course> = {
  "course-001": {
    id: "course-001",
    title: "Full-Stack Web Development Bootcamp",
    description:
      "Master React, Node.js, and MongoDB to build production-ready full-stack web applications from scratch. This comprehensive bootcamp covers everything from HTML/CSS fundamentals to deploying cloud-native apps.",
    price: 4999,
    duration: "48 hours",
    category: "Development",
    instructor: "Ravi Shankar",
    rating: 4.8,
    studentsEnrolled: 12400,
  },
  "course-002": {
    id: "course-002",
    title: "UI/UX Design Masterclass",
    description:
      "Learn Figma, design systems, and user research methodologies to create stunning digital products loved by millions.",
    price: 3499,
    duration: "32 hours",
    category: "Design",
    instructor: "Priya Mehta",
    rating: 4.7,
    studentsEnrolled: 8900,
  },
  "course-003": {
    id: "course-003",
    title: "Machine Learning with Python",
    description:
      "Dive into supervised & unsupervised learning, neural networks, and real-world ML pipelines used in industry.",
    price: 5999,
    duration: "60 hours",
    category: "AI & ML",
    instructor: "Dr. Aditya Kumar",
    rating: 4.9,
    studentsEnrolled: 6200,
  },
  "course-004": {
    id: "course-004",
    title: "AWS Cloud Practitioner & Solutions Architect",
    description:
      "Prepare for AWS certifications by mastering EC2, S3, Lambda, RDS, and cloud architecture best practices.",
    price: 3999,
    duration: "40 hours",
    category: "Cloud",
    instructor: "Neha Gupta",
    rating: 4.6,
    studentsEnrolled: 9100,
  },
  "course-005": {
    id: "course-005",
    title: "Data Analysis with Excel & Power BI",
    description:
      "Transform raw data into compelling dashboards and business insights using Excel and Power BI.",
    price: 2499,
    duration: "24 hours",
    category: "Data",
    instructor: "Kiran Bhat",
    rating: 4.5,
    studentsEnrolled: 11300,
  },
  "course-006": {
    id: "course-006",
    title: "Digital Marketing & SEO Fundamentals",
    description:
      "Master SEO, Google Ads, social media marketing, and analytics to grow any business online.",
    price: 1999,
    duration: "20 hours",
    category: "Marketing",
    instructor: "Anjali Rao",
    rating: 4.4,
    studentsEnrolled: 14700,
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course =
    MOCK_COURSE_MAP[courseId] ?? { title: "Course Enrollment", description: "" };
  return {
    title: `Enroll – ${course.title}`,
    description: `Enroll in "${course.title}" and start learning today.`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────
export default async function EnrollPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  let course: Course;
  try {
    course = await getCourse(courseId);
  } catch {
    // Fall back to mock data
    const mockCourse = MOCK_COURSE_MAP[courseId];
    if (!mockCourse) notFound();
    course = mockCourse;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 font-medium mb-8 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left – Course summary */}
        <div className="space-y-6">
          {/* Badge */}
          {course.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              {course.category}
            </span>
          )}

          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            {course.title}
          </h1>

          <p className="text-gray-600 leading-relaxed">{course.description}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-violet-500" />
              <span className="font-medium">{course.duration}</span>
            </div>
            {course.instructor && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg">
                <span className="text-gray-500">By</span>
                <span className="font-medium">{course.instructor}</span>
              </div>
            )}
            {course.rating && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium">{course.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Price card */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 shadow-lg shadow-violet-200">
            <p className="text-sm font-medium opacity-80 mb-1">Course Price</p>
            <p className="text-4xl font-extrabold mb-4">
              {formatCurrency(course.price)}
            </p>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Secure Razorpay Payment
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Lifetime access to course material
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Certificate of completion
              </li>
            </ul>
          </div>
        </div>

        {/* Right – Enrollment form */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Enter your details
            </h2>
            <EnrollmentForm course={course} />
          </div>

          <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Your information is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
