// Central place for environment-driven configuration.
// VITE_API_URL points to the Express backend (server/src). See .env.example.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// When true, the app runs entirely on the mock data layer (src/mocks) so the
// UI can be previewed/demoed without a running backend. Set to false (or
// remove VITE_USE_MOCK) once the real API at API_BASE_URL is available.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// Google OAuth Client ID from Google Cloud Console (see README for setup).
// The Google sign-in button only renders when this is set.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
