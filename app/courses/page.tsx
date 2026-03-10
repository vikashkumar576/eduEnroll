import type { Metadata } from "next";
import { Suspense } from "react";
import CourseCard from "@/components/CourseCard";
import CourseCardSkeleton from "@/components/CourseCardSkeleton";
import { getCourses } from "@/services/courses.service";
import { BookOpen, Sparkles } from "lucide-react";
import { Course } from "@/types";

export const metadata: Metadata = {
  title: "Browse Courses",
  description:
    "Explore our curated catalogue of top-rated courses. Enroll today and start learning.",
};

// ── Mock data used when backend is unavailable ─────────────────────────────
const MOCK_COURSES: Course[] = [
  {
    id: "course-001",
    title: "Full-Stack Web Development Bootcamp",
    description:
      "Master React, Node.js, and MongoDB to build production-ready full-stack web applications from scratch.",
    price: 4999,
    duration: "48 hours",
    category: "Development",
    instructor: "Ravi Shankar",
    rating: 4.8,
    studentsEnrolled: 12400,
  },
  {
    id: "course-002",
    title: "UI/UX Design Masterclass",
    description:
      "Learn Figma, design systems, and user research methodologies to create stunning digital products.",
    price: 3499,
    duration: "32 hours",
    category: "Design",
    instructor: "Priya Mehta",
    rating: 4.7,
    studentsEnrolled: 8900,
  },
  {
    id: "course-003",
    title: "Machine Learning with Python",
    description:
      "Dive into supervised & unsupervised learning, neural networks, and real-world ML pipelines.",
    price: 5999,
    duration: "60 hours",
    category: "AI & ML",
    instructor: "Dr. Aditya Kumar",
    rating: 4.9,
    studentsEnrolled: 6200,
  },
  {
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
  {
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
  {
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
];

// ── Server data fetcher ────────────────────────────────────────────────────
async function CoursesGrid() {
  let courses: Course[] = [];
  let usedMock = false;

  try {
    const result = await getCourses();
    courses = Array.isArray(result) ? result : MOCK_COURSES;
    if (courses.length === 0) courses = MOCK_COURSES;
    usedMock = courses === MOCK_COURSES;
  } catch {
    courses = MOCK_COURSES;
    usedMock = true;
  }

  return (
    <>
      {courses.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
          <BookOpen className="w-16 h-16 opacity-30" />
          <p className="text-lg font-medium">No courses available yet.</p>
          <p className="text-sm">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}

// ── Skeleton grid (12 cards) ───────────────────────────────────────────────
function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4" />
          Our Courses
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Learn Anything,{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            Anywhere
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          Join thousands of learners. Pick a course, enroll in minutes, and
          start your journey today.
        </p>
      </div>

      {/* Course list */}
      <Suspense fallback={<CoursesGridSkeleton />}>
        <CoursesGrid />
      </Suspense>
    </section>
  );
}
