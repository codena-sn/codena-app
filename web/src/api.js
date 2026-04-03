const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function setTokens(access, refresh) {
  if (access) localStorage.setItem("codena_access", access);
  if (refresh) localStorage.setItem("codena_refresh", refresh);
}

export function getAccess() {
  return localStorage.getItem("codena_access") || "";
}

export async function api(path, { method = "GET", body = null, auth = false } = {}) {
  const headers = {};
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Erreur API");
  return data;
}

export { API };
