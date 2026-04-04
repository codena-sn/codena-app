export async function api(path, { method = "GET", body = null, auth = false, timeoutMs = 20000 } = {}) {
  const headers = {};
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

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
    if (!res.ok) throw new Error(data.detail || "Erreur API");
    return data;
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Le serveur met trop de temps (Render peut être en veille). Réessaie.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
