import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(data: string): string {
  const date = new Date(data); // Convert the input string to a Date object
  return date.toLocaleDateString("en-US", { // Format the date in US English style
      year: "numeric",   // Show full year (e.g., 2025)
      month: "long",     // Show full month name (e.g., August)
      day: "numeric",    // Show numeric day (e.g., 20)
  });
}
