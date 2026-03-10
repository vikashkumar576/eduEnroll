import api from "./api";
import { ApiResponse, Course } from "@/types";

/**
 * Fetch all available courses.
 */
export async function getCourses(): Promise<Course[]> {
  const response = await api.get<ApiResponse<Course[]>>("/api/courses");
  return response.data.data;
}

/**
 * Fetch a single course by ID.
 */
export async function getCourse(id: string): Promise<Course> {
  const response = await api.get<ApiResponse<Course>>(`/api/courses/${id}`);
  return response.data.data;
}
