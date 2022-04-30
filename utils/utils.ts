import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";
import format from "date-fns/format";
import getDay from "date-fns/getDay";

export const cld = new Cloudinary({
  cloud: {
    cloudName: "codewithwhyte",
  },
  url: {
    secure: true,
  },
});

export function reSizeByZoom() {
  return thumbnail()
    .height(150)
    .aspectRatio("5:6")
    .zoom(0.75)
    .gravity(focusOn(face()));
}

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
  else if (isYesterday(date)) return "Yesterday";
  else if (isThisWeek(date)) {
    const day = getDay(date);
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        break;
    }
  } else if (isThisYear(date)) return format(date, "MMM d");
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

function removeExt(publicId: string) {
  const ext = publicId.split(".")[1];
  return publicId.replace(`.${ext}`, "");
}

export function getPublicId(url: string | null) {
  if (!url) return "";
  const urlParts = url.split("/");
  return removeExt(urlParts[urlParts.length - 1]);
}

export function scaleImageHeight(h: number, w: number, maxWidth: number) {
  let ratio = w / h;
  let newH = Math.round((w > maxWidth ? maxWidth : w) * ratio);
  if (newH > 400) {
    newH = 400;
  }
  if (w < maxWidth) {
    return {
      width: maxWidth,
      height: newH,
    };
  }
  return {
    width: w > maxWidth ? maxWidth : w,
    height: newH,
  };
}
