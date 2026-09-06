/**
 * Resolves image URLs from the backend API.
 *
 * The API may return:
 *   - A full absolute URL  (https://…/media/photo.jpg)  → use as-is
 *   - A root-relative path (/media/photo.jpg)           → prepend backend origin
 *   - null / undefined                                   → placeholder
 */
export const getImageUrl = (url) => {
  if (!url) return "/placeholder.png";

  // Already an absolute URL — nothing to fix
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // Derive backend origin from VITE_API_URL  (e.g. "https://x.onrender.com/api/" → "https://x.onrender.com")
  const apiUrl = import.meta.env.VITE_API_URL || "";
  const backendBase = apiUrl.replace(/\/api\/?$/, "");

  return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
};
