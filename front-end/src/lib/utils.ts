import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://instapay-project-production.up.railway.app";