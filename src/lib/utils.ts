import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(date: Date) {
  return SHORT_DATE_FORMATTER.format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startLabel = MONTH_YEAR_FORMATTER.format(startDate);
  let endLabel = "";

  if (endDate) {
    if (typeof endDate === "string") {
      endLabel = endDate;
    } else {
      endLabel = MONTH_YEAR_FORMATTER.format(endDate);
    }
  }

  return `${startLabel} - ${endLabel}`;
}
