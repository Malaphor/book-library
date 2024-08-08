import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isbnRegex = /((?:97[89])?\d{9}[\dx])/i;

export const isValidIsbn = (str: string) => {
  const matches = str.match(isbnRegex);

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
  if (bookName.lastIndexOf(".") === -1) return bookName;

  return bookName.substring(0, bookName.lastIndexOf("."));
};

export const languages = [
  { code: "ab", name: "Abkhazian" },
  { code: "aa", name: "Afar" },
  { code: "af", name: "Afrikaans" },
  { code: "ak", name: "Akan" },
  { code: "sq", name: "Albanian" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic" },
  { code: "an", name: "Aragonese" },
  { code: "hy", name: "Armenian" },
  { code: "as", name: "Assamese" },
  { code: "av", name: "Avaric" },
  { code: "ae", name: "Avestan" },
  { code: "ay", name: "Aymara" },
  { code: "az", name: "Azerbaijani" },
  { code: "bm", name: "Bambara" },
  { code: "ba", name: "Bashkir" },
  { code: "eu", name: "Basque" },
  { code: "be", name: "Belarusian" },
  { code: "bn", name: "Bengali (Bangla)" },
  { code: "bh", name: "Bihari" },
  { code: "bi", name: "Bislama" },
  { code: "bs", name: "Bosnian" },
  { code: "br", name: "Breton" },
  { code: "bg", name: "Bulgarian" },
  { code: "my", name: "Burmese" },
  { code: "ca", name: "Catalan" },
  { code: "ch", name: "Chamorro" },
  { code: "ce", name: "Chechen" },
  { code: "ny", name: "Chichewa, Chewa, Nyanja" },
  { code: "zh", name: "Chinese" },
  { code: "zh-Hans", name: "Chinese (Simplified)" },
  { code: "zh-Hant", name: "Chinese (Traditional)" },
  { code: "cv", name: "Chuvash" },
  { code: "kw", name: "Cornish" },
  { code: "co", name: "Corsican" },
  { code: "cr", name: "Cree" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "dv", name: "Divehi, Dhivehi, Maldivian" },
  { code: "nl", name: "Dutch" },
  { code: "dz", name: "Dzongkha" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian" },
  { code: "ee", name: "Ewe" },
  { code: "fo", name: "Faroese" },
  { code: "fj", name: "Fijian" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "ff", name: "Fula, Fulah, Pulaar, Pular" },
  { code: "gl", name: "Galician" },
  { code: "gd", name: "Gaelic (Scottish)" },
  { code: "gv", name: "Gaelic (Manx)" },
  { code: "ka", name: "Georgian" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "kl", name: "Greenlandic" },
  { code: "gn", name: "Guarani" },
  { code: "gu", name: "Gujarati" },
  { code: "ht", name: "Haitian Creole" },
  { code: "ha", name: "Hausa" },
  { code: "he", name: "Hebrew" },
  { code: "hz", name: "Herero" },
  { code: "hi", name: "Hindi" },
  { code: "ho", name: "Hiri Motu" },
  { code: "hu", name: "Hungarian" },
  { code: "is", name: "Icelandic" },
  { code: "io", name: "Ido" },
  { code: "ig", name: "Igbo" },
  { code: "id, in", name: "Indonesian" },
  { code: "ia", name: "Interlingua" },
  { code: "ie", name: "Interlingue" },
  { code: "iu", name: "Inuktitut" },
  { code: "ik", name: "Inupiak" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "jv", name: "Javanese" },
  { code: "kl", name: "Kalaallisut, Greenlandic" },
  { code: "kn", name: "Kannada" },
  { code: "kr", name: "Kanuri" },
  { code: "ks", name: "Kashmiri" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "ki", name: "Kikuyu" },
  { code: "rw", name: "Kinyarwanda (Rwanda)" },
  { code: "rn", name: "Kirundi" },
  { code: "ky", name: "Kyrgyz" },
  { code: "kv", name: "Komi" },
  { code: "kg", name: "Kongo" },
  { code: "ko", name: "Korean" },
  { code: "ku", name: "Kurdish" },
  { code: "kj", name: "Kwanyama" },
  { code: "lo", name: "Lao" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian (Lettish)" },
  { code: "li", name: "Limburgish ( Limburger)" },
  { code: "ln", name: "Lingala" },
  { code: "lt", name: "Lithuanian" },
  { code: "lu", name: "Luga-Katanga" },
  { code: "lg", name: "Luganda, Ganda" },
  { code: "lb", name: "Luxembourgish" },
  { code: "gv", name: "Manx" },
  { code: "mk", name: "Macedonian" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam" },
  { code: "mt", name: "Maltese" },
  { code: "mi", name: "Maori" },
  { code: "mr", name: "Marathi" },
  { code: "mh", name: "Marshallese" },
  { code: "mo", name: "Moldavian" },
  { code: "mn", name: "Mongolian" },
  { code: "na", name: "Nauru" },
  { code: "nv", name: "Navajo" },
  { code: "ng", name: "Ndonga" },
  { code: "nd", name: "Northern Ndebele" },
  { code: "ne", name: "Nepali" },
  { code: "no", name: "Norwegian" },
  { code: "nb", name: "Norwegian bokmål" },
  { code: "nn", name: "Norwegian nynorsk" },
  { code: "ii", name: "Nuosu" },
  { code: "oc", name: "Occitan" },
  { code: "oj", name: "Ojibwe" },
  { code: "cu", name: "Old Church Slavonic, Old Bulgarian" },
  { code: "or", name: "Oriya" },
  { code: "om", name: "Oromo (Afaan Oromo)" },
  { code: "os", name: "Ossetian" },
  { code: "pi", name: "Pāli" },
  { code: "ps", name: "Pashto, Pushto" },
  { code: "fa", name: "Persian (Farsi)" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi (Eastern)" },
  { code: "qu", name: "Quechua" },
  { code: "rm", name: "Romansh" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "se", name: "Sami" },
  { code: "sm", name: "Samoan" },
  { code: "sg", name: "Sango" },
  { code: "sa", name: "Sanskrit" },
  { code: "sr", name: "Serbian" },
  { code: "sh", name: "Serbo-Croatian" },
  { code: "st", name: "Sesotho" },
  { code: "tn", name: "Setswana" },
  { code: "sn", name: "Shona" },
  { code: "ii", name: "Sichuan Yi" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhalese" },
  { code: "ss", name: "Siswati" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "so", name: "Somali" },
  { code: "nr", name: "Southern Ndebele" },
  { code: "es", name: "Spanish" },
  { code: "su", name: "Sundanese" },
  { code: "sw", name: "Swahili (Kiswahili)" },
  { code: "ss", name: "Swati" },
  { code: "sv", name: "Swedish" },
  { code: "tl", name: "Tagalog" },
  { code: "ty", name: "Tahitian" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "bo", name: "Tibetan" },
  { code: "ti", name: "Tigrinya" },
  { code: "to", name: "Tonga" },
  { code: "ts", name: "Tsonga" },
  { code: "tr", name: "Turkish" },
  { code: "tk", name: "Turkmen" },
  { code: "tw", name: "Twi" },
  { code: "ug", name: "Uyghur" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "uz", name: "Uzbek" },
  { code: "ve", name: "Venda" },
  { code: "vi", name: "Vietnamese" },
  { code: "vo", name: "Volapük" },
  { code: "wa", name: "Wallon" },
  { code: "cy", name: "Welsh" },
  { code: "wo", name: "Wolof" },
  { code: "fy", name: "Western Frisian" },
  { code: "xh", name: "Xhosa" },
  { code: "yi, ji", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "za", name: "Zhuang, Chuang" },
  { code: "zu", name: "Zulu" },
];

export const getLanguage = (code: string) => {
  const language = languages.find((lang) => {
    return lang.code === code?.toLowerCase();
  });

  return language?.name ?? "Unknown";
};
