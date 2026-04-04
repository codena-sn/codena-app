// web/src/api.js

// ✅ API base URL (Render via VITE_API_URL, sinon local)
export const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --------- Tokens ----------
export function setTokens(access, refresh) {
  if (access) localStorage.setItem("codena_access", access);
  if (refresh) localStorage.setItem("codena_refresh", refresh);
}

export function getAccess() {
  return localStorage.getItem("codena_access") || "";
}

export function getRefresh() {
  return localStorage.getItem("codena_refresh") || "";
}

export function clearTokens() {
  localStorage.removeItem("codena_access");
  localStorage.removeItem("codena_refresh");
}

// --------- Core fetch with timeout + retry ----------
export async function api(
  path,
  { method = "GET", body = null, auth = false, timeoutMs = 20000, retryOn503 = true } = {}
) {
  const headers = {};
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  async function doFetchOnce() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${API}${path}`, {
        method,
        headers,
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      if (e.name === "AbortError") {
        throw new Error("Le serveur met trop de temps (Render peut être en veille). Réessaie.");
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  // 1er essai
  let r = await doFetchOnce();

  // Retry 1 fois si Render wake-up (502/503)
  if (!r.ok && retryOn503 && (r.status === 502 || r.status === 503)) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    r = await doFetchOnce();
  }

  if (!r.ok) {
    // message d'erreur lisible
    const msg = r.data?.detail || `Erreur API (${r.status})`;
    throw new Error(msg);
  }

  return r.data;
}

// --------- Optional: refresh token helper (si tu veux l'utiliser plus tard) ----------
export async function refreshToken() {
  const refresh = getRefresh();
  if (!refresh) throw new Error("Refresh token manquant");

  const r = await api("/auth/refresh", {
    method: "POST",
    body: { refresh_token: refresh },
    auth: false,
    timeoutMs: 20000,
    retryOn503: true,
  });

  setTokens(r.access_token, r.refresh_token);
  return r.access_token;
}
