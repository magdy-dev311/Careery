// ===== Careery shared frontend helper =====
// 🔧 غيّر العنوان ده لو شغّلت السيرفر على دومين/بورت مختلف
const API_BASE = "http://localhost:5000/api";

function getToken() { return localStorage.getItem("token"); }
function getUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch (e) { return null; }
}
function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "auth.html";
}
function getInitials() {
  const u = getUser();
  if (!u) return "?";
  return (u.initials || ((u.firstName?.[0]||"")+(u.lastName?.[0]||""))).toUpperCase();
}

// Redirect to login if no token. Returns true if authenticated.
function requireAuth() {
  if (!getToken()) {
    window.location.href = "auth.html";
    return false;
  }
  return true;
}

// Generic authenticated fetch wrapper
async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch(API_BASE + path, { ...options, headers });
  if (res.status === 401) {
    logout();
    return null;
  }
  return res;
}

// Decide where "Get Started" should take the user
async function goGetStarted() {
  if (!getToken()) {
    window.location.href = "auth.html";
    return;
  }
  const user = getUser();
  if (user && user.quizCompleted) {
    window.location.href = "roadmap.html";
  } else {
    window.location.href = "quiz.html";
  }
}
