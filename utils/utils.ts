import { isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import format from "date-fns/format";

// is file a valid image file
export const isImage = (file: any) => {
  return file.type.split("/")[0] === "image";
};

// get channel acronym
export function getAcronyms(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

export function formattedTime(createdAt: string) {
  if (!createdAt) return "";
  const date = new Date(createdAt as any);
  if (isToday(date)) return format(date, "hh:mm a");
  else if (isYesterday(date)) return "yesterday";
  else if (isThisWeek(date)) return format(date, "ddd");
  else if (isThisYear(date)) return format(date, "MMM d");
  else return format(date, "M/d/yyyy");
}

export function getNumberOfDays(createdAt: string) {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;
  const dateObject = new Date(dateString);
  const timeDiff = Math.abs(Date.now() - dateObject.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (diffDays <= 1) {
    return "today";
  }
}
