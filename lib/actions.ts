"use server";

import Book from "@/models/Book";
import dbConnect from "./dbconnect";
import {
  BookDocument,
  EditBookDocument,
  editBookServerSchema,
} from "./constants";
import sharp from "sharp";
import mongoose from "mongoose";
import { utapi } from "./uploadthing";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getRecentlyAddedBooks = async () => {
  await dbConnect();

  const books = await Book.find().lean().sort({ createdAt: 1 }).limit(10);
  return books as BookDocument[];
};

export const getBook = async (bookId: string) => {
  await dbConnect(); /* 
  const foo = mongoose.Types.ObjectId.isValid(bookId);
  console.log("foo", foo); */
  const book = await Book.findById(bookId).lean();
  const filteredBook = JSON.parse(JSON.stringify(book));

  return filteredBook as BookDocument;
};

export const resizeCoverImage = async (imageBlob: Blob, title: string) => {
  try {
    const extension = imageBlob.type.substring(imageBlob.type.indexOf("/") + 1);
    const imageBuffer = await imageBlob.arrayBuffer();
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(300, 450)
      .toBuffer();

    const resizedImage = new File(
      [resizedImageBuffer],
      `${title}.${extension}`,
      { type: imageBlob.type }
    );

    return resizedImage;
  } catch (error) {
    console.error(error);
  }
};

export const getBookToRead = async (
  bookId: string
): Promise<{ bookUrl: string; imageUrl: string; page: number }> => {
  try {
    await dbConnect();

    //const currentBook =  await User.find
    let page;

    const book = (await Book.findById(bookId).lean()) as BookDocument;

    if (!book) {
      throw new Error("Book not found");
    }
    console.log(book.bookUrl);
    return { bookUrl: book.bookUrl, imageUrl: book.imageUrl, page: page ?? 1 };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateBookInfo = async (data: EditBookDocument) => {
  try {
    const result = editBookServerSchema.safeParse(data);
    if (!result.success) {
      console.log(result.error);
      return {
        message: "Book failed to update: incorrect data type. Try again.",
        error: true,
      };
    }
    console.log(result);
    await dbConnect();

    const updatedBook = await Book.findByIdAndUpdate(
      result.data.id,
      result.data,
      {
        new: true,
      }
    ).lean();
    console.log(updatedBook);

    if (!updatedBook)
      return {
        message: "Book failed to update. Try again later.",
        error: true,
      };

    return { message: "Book updated", error: false };
  } catch (err) {
    console.error(err);
    return { message: "Book failed to update. Try again later.", error: err };
  }
};

export const deleteBook = async (bookId: string) => {
  try {
    await dbConnect();

    const book = await Book.findById(bookId);

    if (!book)
      return {
        message: "Book failed to delete. Try again later.",
        error: true,
      };

    const fileKey = book.bookUrl.substring(book.bookUrl.lastIndexOf("/") + 1);
    const imageKey = book.imageUrl.substring(
      book.imageUrl.lastIndexOf("/") + 1
    );

    await utapi.deleteFiles([fileKey, imageKey]);

    await Book.deleteOne({ _id: bookId });

    return { message: "Book deleted", error: false };
  } catch (err) {
    console.error(err);
    return { message: "Book failed to delete. Try again later.", error: err };
  }
};

export const navigateToHome = async () => {
  revalidatePath("/");
  redirect("/");
};
