import type { Course } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data as T;
}

export async function signup(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<string> {
  const data = await fetchJson<{ message: string }>("/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return data.message;
}

export async function signin(input: { email: string; password: string }): Promise<string> {
  const data = await fetchJson<{ token: string }>("/user/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return data.token;
}

export async function getCourses(): Promise<Course[]> {
  const data = await fetchJson<{ courses: Course[] }>("/course/preview");
  return data.courses ?? [];
}

export async function getPurchasedCourses(token: string): Promise<Course[]> {
  const data = await fetchJson<{ coursesData: Course[] }>("/user/purchases", {
    headers: { token },
  });
  return data.coursesData ?? [];
}

export async function purchaseCourse(token: string, courseId: string): Promise<string> {
  const data = await fetchJson<{ message: string }>("/course/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json", token },
    body: JSON.stringify({ courseId }),
  });
  return data.message;
}

export async function adminSignin(input: { email: string; password: string }): Promise<string> {
  const data = await fetchJson<{ token: string }>("/admin/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return data.token;
}

export async function getAdminCourses(token: string): Promise<Course[]> {
  const data = await fetchJson<{ courses: Course[] }>("/admin/course/bulk", {
    headers: { token },
  });
  return data.courses ?? [];
}

export async function adminCreateCourse(
  token: string,
  input: {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
  }
): Promise<string> {
  const data = await fetchJson<{ message: string }>("/admin/course", {
    method: "POST",
    headers: { "Content-Type": "application/json", token },
    body: JSON.stringify(input),
  });
  return data.message;
}

export async function adminUpdateCourse(
  token: string,
  input: {
    courseId: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
  }
): Promise<string> {
  const data = await fetchJson<{ message: string }>("/admin/course", {
    method: "PUT",
    headers: { "Content-Type": "application/json", token },
    body: JSON.stringify(input),
  });
  return data.message;
}
