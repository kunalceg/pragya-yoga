// ─────────────────────────────────────────────────────────
// studentservice.jsx
// All API calls for the student dashboard.
// JWT token is read from localStorage and sent as Bearer header.
// ─────────────────────────────────────────────────────────

// Dynamically sets the domain based on environment variables with your production Render server as the default fallback
const API_DOMAIN = import.meta.env.VITE_API_URL || "https://pragya-yoga.onrender.com";
const BASE_URL = `${API_DOMAIN}/api/auth`;

// Helper: returns headers with Authorization token automatically injected
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

// ──────────────────────────────────────────
// GET /profile — fetch logged-in student data
// Called when studentdashboard page loads
// ──────────────────────────────────────────
export const getStudentProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: authHeaders()
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch student profile");
  }

  return await res.json();
};

// ──────────────────────────────────────────
// PUT /profile — save edited profile fields
// Called when student clicks Save in ProfilePage
// ──────────────────────────────────────────
export async function updateStudentProfile(formData) {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update profile");
  }

  return res.json(); 
}