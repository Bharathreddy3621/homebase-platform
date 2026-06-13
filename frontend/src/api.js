const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const isFormData = (value) =>
  typeof FormData !== "undefined" && value instanceof FormData;

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const body = options.body;

  if (body && !isFormData(body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  let payload = null;

  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    const error = new Error(
      payload?.error || payload?.errors?.[0] || "Request failed"
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
