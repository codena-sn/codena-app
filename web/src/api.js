const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
export function getAccess(){ return localStorage.getItem("codena_access") || ""; }
export function getRefresh(){ return localStorage.getItem("codena_refresh") || ""; }
export function setTokens(access, refresh){
  if(access) localStorage.setItem("codena_access", access);
  if(refresh) localStorage.setItem("codena_refresh", refresh);
}
export async function api(path, {method="GET", body=null, auth=false}={}){
  const headers = {};
  if(!(body instanceof FormData)) headers["Content-Type"]="application/json";
  if(auth){ const t=getAccess(); if(t) headers["Authorization"]=`Bearer ${t}`; }
  const res = await fetch(`${API}${path}`, {method, headers, body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null});
  const data = await res.json().catch(()=> ({}));
  if(!res.ok) throw new Error(data.detail || "Erreur API");
  return data;
}
export async function refreshIfNeeded(){
  const refresh=getRefresh();
  const t = await api("/auth/refresh",{method:"POST", body:{refresh_token: refresh}});
  setTokens(t.access_token, t.refresh_token);
  return t.access_token;
}
export { API };
