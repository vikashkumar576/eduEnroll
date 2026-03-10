import api from "./api";
import { ApiResponse, Course } from "@/types";

/**
 * Fetch all available courses.
 */
export async function getCourses(): Promise<Course[]> {
  const response = await api.get<ApiResponse<Course[]>>("/api/courses");
  const data = response.data?.data;
  if (!data) throw new Error("No courses data returned from API");
  return data;
}

/**
 * Fetch a single course by ID.
 */
export async function getCourse(id: string): Promise<Course> {
  const response = await api.get<ApiResponse<Course>>(`/api/courses/${id}`);
  const data = response.data?.data;
  if (!data) throw new Error(`No data returned for course ${id}`);
  return data;
}
