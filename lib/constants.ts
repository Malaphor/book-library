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
    contributors: z.string().optional(),
    lang: z.string().optional(),
    pages: z.number().int().gte(1),
  }),
});

export const editBookFormSchema = z.object({
  title: z.string().min(2).max(150),
  author: z.string().min(2).max(150),
  isbn: z.string().min(10).max(13),
  publishYear: z.string().length(4),
  contributors: z.string(),
  lang: z.string(),
});

export const editBookServerSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(150),
  author: z.string().min(2).max(150),
  isbn: z.string().min(10).max(13),
  publishYear: z.number().int().gte(1000).lte(9999),
  contributors: z.string(),
  lang: z.string(),
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

export type EditBookFormProps = {
  book: BookDocument;
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
  contributors: string;
  lang: string;
};

export type EditBookDocument = {
  id: Types.ObjectId;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  contributors: string;
  lang: string;
};
