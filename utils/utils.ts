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
