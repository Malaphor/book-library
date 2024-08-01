"use server";

import Book from "@/models/Book";
import dbConnect from "./dbconnect";
import { BookDocument } from "./constants";
import sharp from "sharp";

export const getRecentlyAddedBooks = async () => {
  await dbConnect();

  const books = await Book.find().lean().sort({ createdAt: 1 }).limit(10);
  return books as BookDocument[];
};

export const getBook = async (bookId: string) => {
  await dbConnect();

  const book = await Book.findById(bookId).lean();

  return book as BookDocument;
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
