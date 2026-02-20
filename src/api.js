const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const jsonHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const api = {
  async getCourses(admin = false) {
    const res = await fetch(`${API_BASE}/courses${admin ? "?admin=1" : ""}`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },

  async adminLogin(email, password) {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  async createCourse(payload, token) {
    const res = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Create course failed");
    return data;
  },

  async updateCourse(courseId, payload, token) {
    const res = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: "PUT",
      headers: jsonHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update course failed");
    return data;
  },

  async uploadCoursePdf(courseId, pdfFile, title, token) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    if (title) formData.append("title", title);

    const res = await fetch(`${API_BASE}/courses/${courseId}/pdf`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "PDF upload failed");
    return data;
  },

  async deleteCoursePdf(courseId, pdfId, token) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/pdf/${pdfId}`, {
      method: "DELETE",
      headers: jsonHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "PDF delete failed");
    return data;
  },

  toAbsoluteFileUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
  },
};
