import { Types } from "mongoose";
import { z } from "zod";

export const addBookFormSchema = z.object({
  bookFile: z.custom<FileList>(),
  title: z.string().min(2).max(150),
  author: z.string().min(2).max(150),
  isbn: z.string().min(10).max(13),
  publishYear: z.string().length(4),
  olid: z.string().array().optional(),
});

export const addBookServerSchema = z.object({
  bookFile: z.custom<File>(),
  image: z.custom<Blob>(),
  title: z.string().min(2).max(150),
  author: z.string().min(2).max(150),
  isbn: z.string().min(10).max(13),
  publishYear: z.number().int().gte(1000).lte(9999),
  extra: z.object({
    contributors: z.array(z.string()),
    lang: z.string(),
  }),
});

export type BookEditType = {
  bookId: Types.ObjectId;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
};

export type BookNewType = {
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  data: ArrayBuffer;
  image: ArrayBuffer;
};

export type UploadThingUpload = {
  bookFile: File;
  image: File;
};

export type AddBookFormProps = {
  closeDialog: () => void;
};

export type ApiResponse = {
  message: string;
  error?: Error;
};

export type BookCoverProps = {
  imageUrl: string;
  title: string;
  author: string;
  year: number;
  bookId: string;
};

export type BookDocument = {
  _id: Types.ObjectId;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  bookUrl: string;
  imageUrl: string;
  contributors: string[];
  lang: string;
};
