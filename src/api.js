const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const jsonHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const parseJsonSafely = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

const authorizedFetch = async (url, token, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

export const api = {
  async getCourses({ admin = false, token = "" } = {}) {
    const res = await fetch(`${API_BASE}/courses${admin ? "?admin=1" : ""}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },

  async signup({ name, email, password }) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Signup failed");
    return data;
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  async adminLogin(email, password) {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  async createCourse(payload, token) {
    const res = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Create course failed");
    return data;
  },

  async updateCourse(courseId, payload, token) {
    const res = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: "PUT",
      headers: jsonHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Update course failed");
    return data;
  },

  async uploadCoursePdf(courseId, pdfFile, title, token) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    if (title) formData.append("title", title);

    const res = await authorizedFetch(`${API_BASE}/courses/${courseId}/pdf`, token, {
      method: "POST",
      body: formData,
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "PDF upload failed");
    return data;
  },

  async deleteCoursePdf(courseId, pdfId, token) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/pdf/${pdfId}`, {
      method: "DELETE",
      headers: jsonHeaders(token),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "PDF delete failed");
    return data;
  },

  async createRazorpayOrder(courseId, token) {
    const res = await fetch(`${API_BASE}/payments/razorpay/order`, {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify({ courseId }),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Failed to create payment order");
    return data;
  },

  async verifyRazorpayPayment(payload, token) {
    const res = await fetch(`${API_BASE}/payments/razorpay/verify`, {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Payment verification failed");
    return data;
  },

  async getMyCourses(token) {
    const res = await fetch(`${API_BASE}/payments/my-courses`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const data = await parseJsonSafely(res);
    if (!res.ok) throw new Error(data.message || "Failed to fetch your courses");
    return data;
  },

  async openPdfInNewTab(courseId, pdfId, token) {
    const res = await authorizedFetch(`${API_BASE}/courses/${courseId}/pdfs/${pdfId}/view`, token);
    if (!res.ok) {
      const data = await parseJsonSafely(res);
      throw new Error(data.message || "Failed to open PDF");
    }

    const blob = await res.blob();
    const pdfUrl = window.URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  },

  toAbsoluteApiUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
  },
};
