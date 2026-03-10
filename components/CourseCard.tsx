"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { Course } from "@/types";
import { formatCurrency, truncate, generateStars } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const stars = generateStars(course.rating ?? 0);

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-violet-500 to-indigo-600 overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/60" />
          </div>
        )}
        {/* Category badge */}
        {course.category && (
          <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
            {course.category}
          </span>
        )}
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white text-violet-700 text-sm font-bold px-3 py-1 rounded-full shadow-md">
          {formatCurrency(course.price)}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Instructor */}
        {course.instructor && (
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {course.instructor}
          </p>
        )}

        {/* Title */}
        <h2 className="text-gray-900 font-semibold text-lg leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed">
          {truncate(course.description, 100)}
        </p>

        {/* Rating */}
        {course.rating !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {stars.map((type, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    type === "full"
                      ? "text-amber-400 fill-amber-400"
                      : type === "half"
                      ? "text-amber-400 fill-amber-200"
                      : "text-gray-300 fill-gray-100"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {course.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
          {course.studentsEnrolled !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.studentsEnrolled.toLocaleString()} students
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link
          href={`/enroll/${course.id}`}
          className="block w-full text-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          aria-label={`Enroll in ${course.title}`}
        >
          Enroll Now
        </Link>
      </div>
    </article>
  );
}
