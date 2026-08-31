import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getInitials(name) {
  if (!name) return "";
  const parts = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(2, parts.length); i++) {
    if (parts[i].length > 0) {
      initials += parts[i][0].toUpperCase();
    }
  }
  return initials;
}

export function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Get base url by removing /api from NEXT_PUBLIC_API_URL
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://pos-backend-qcky.onrender.com/api";
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");

  return `${baseUrl}${path}`;
}
