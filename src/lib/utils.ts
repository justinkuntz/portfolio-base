import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const startYear = startDate.getFullYear().toString();
  const startLabel = `${startMonth} ${startYear}`;
  let endLabel = "";

  if (endDate) {
    if (typeof endDate === "string") {
      endLabel = endDate;
    } else {
      const endMonth = endDate.toLocaleString("default", { month: "short" });
      const endYear = endDate.getFullYear().toString();
      endLabel = `${endMonth} ${endYear}`;
    }
  }

  return `${startLabel} - ${endLabel}`;
}
