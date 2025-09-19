// src/lib/cookies.js
export function setCookie(name, value, days = 7) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}
export function eraseCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}
