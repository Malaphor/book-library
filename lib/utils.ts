import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isbnRegex = /((?:97[89])?\d{9}[\dx])/i;

export const isValidIsbn = (str: string) => {
  const matches = str.match(isbnRegex);
  console.log("matches:", matches);
  if (matches !== null) {
    return matches[0].length === 10
      ? isValidIsbn10(matches[0]) // ISBN-10
      : isValidIsbn13(matches[0]); // ISBN-13
  }
  return false;
};

const isValidIsbn10 = (isbn: string) => {
  let check = 0;

  for (let i = 0; i < 10; i++) {
    if (isbn[i].toLowerCase() === "x") {
      check += 10 * (10 - i);
    } else if (!isNaN(+isbn[i])) {
      check += Number(isbn[i]) * (10 - i);
    } else {
      return false;
    }
  }

  return 0 === check % 11 ? true : false;
};

const isValidIsbn13 = (isbn: string) => {
  let check = 0;

  for (let i = 0; i < 13; i += 2) {
    check += Number(isbn[i]);
  }

  for (let i = 1; i < 12; i += 2) {
    check += 3 * Number(isbn[i]);
  }

  return check % 10 === 0 ? true : false;
};

export const getImageName = (bookName: string) => {
  return bookName.substring(0, bookName.lastIndexOf("."));
};
