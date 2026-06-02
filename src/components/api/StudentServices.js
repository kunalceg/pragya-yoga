// ─────────────────────────────────────────────────────────
// StudentServices.js
// All API calls for the student dashboard.
// JWT token is read from localStorage and sent as Bearer header.
// ─────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

// Helper: returns headers with Authorization token
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ──────────────────────────────────────────
// GET /profile — fetch logged-in student data
// Called when studentdashboard page loads
// ──────────────────────────────────────────
export const getStudentProfile = async () => {
  // 🎯 FIX: Always read the fresh token directly from storage inside the function execution block
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/auth/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Sends the fresh bearer token safely
    }
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

  return res.json(); // Returns updated user object from MongoDB
}
