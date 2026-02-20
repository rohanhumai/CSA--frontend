const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const token = localStorage.getItem("token") || localStorage.getItem("course_user_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toQueryString = (params) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const request = async (method, path, body, options = {}) => {
  const url = `${API_BASE}${path}${toQueryString(options.params)}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("course_user_token");
      localStorage.removeItem("course_user_email");
      window.location.href = "/login";
    }

    const error = new Error(data?.message || "Request failed");
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
};

const api = {
  get: (path, options) => request("GET", path, undefined, options),
  post: (path, body, options) => request("POST", path, body, options),
  put: (path, body, options) => request("PUT", path, body, options),
  delete: (path, options) => request("DELETE", path, undefined, options),
};

export default api;
