"use client";

import { useState, useEffect } from "react";
import { getCourses } from "@/services/courses.service";
import { Course, ApiError } from "@/types";

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCourses()
      .then((data) => {
        if (!cancelled) setCourses(data);
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = () => setTick((t) => t + 1);

  return { courses, loading, error, refetch };
}
