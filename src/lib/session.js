//[Session.Js]
export const session = {
  getUserToken() {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("userToken") || "";
  },

  getAdminToken() {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("adminToken") || "";
  },

  setUserAuth(token, user) {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem("userToken", token);
    if (user) window.localStorage.setItem("currentUser", JSON.stringify(user));
  },

  clearUserAuth() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("userToken");
    window.localStorage.removeItem("currentUser");
  },

  setAdminToken(token) {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem("adminToken", token);
  },

  clearAdminToken() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("adminToken");
  },
};
