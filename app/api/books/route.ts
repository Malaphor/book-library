import { resizeCoverImage } from "@/lib/actions";
import { addBookServerSchema } from "@/lib/constants";
import dbConnect from "@/lib/dbconnect";
import { utapi } from "@/lib/uploadthing";
import Book from "@/models/Book";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { UploadFileResult } from "uploadthing/types";

export const GET = async () => {
  try {
    await dbConnect();

    const books = await Book.find();

    return new NextResponse(JSON.stringify(books));
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error getting books.", error })
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const fd = await req.formData();

    const fdJson = {
      title: fd.get("title"),
      author: fd.get("author"),
      isbn: fd.get("isbn"),
      publishYear: parseInt(fd.get("publishYear") as string),
      bookFile: fd.get("bookFile"),
      image: fd.get("image"),
      extra: JSON.parse(String(fd.get("extra"))),
    };

    console.log("fd", fdJson);

    const result = addBookServerSchema.safeParse(fdJson);
    if (!result.success) {
      console.log(result.error);
      return new NextResponse(
        JSON.stringify({
          message: "Wrong type or missing data",
          error: result.error,
        })
      );
    }

    if (result.data.bookFile.type !== "application/pdf") {
      return new NextResponse(
        JSON.stringify({
          message: "Book file type is not supported",
          error: true,
        })
      );
    }

    const resizedImage = await resizeCoverImage(
      result.data.image,
      result.data.bookFile.name
    );

    const response: UploadFileResult[] = await utapi.uploadFiles([
      result.data.bookFile,
      resizedImage as File,
    ]);

    if (!response || response[0].error || response[1].error) {
      console.log(response[0].error, response[1].error);
      return new NextResponse(
        JSON.stringify({
          message: "Error uploading files",
          error: true,
        })
      );
    }

    await dbConnect();

    const newBook = new Book({
      title: result.data.title,
      author: result.data.author,
      isbn: result.data.isbn,
      publishYear: result.data.publishYear,
      bookUrl: response[0].data.url,
      imageUrl: response[1].data.url,
      contributors: result.data.extra.contributors?.split("/"),
      lang: result.data.extra.lang,
      numPages: result.data.extra.pages,
    });

    await newBook.save();

    return new NextResponse(
      JSON.stringify({ message: "Book created successfully" })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Error uploading book.", error })
    );
  }
};

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();

    const { bookId, title, author, isbn, publishYear } = body;

    if (!bookId)
      return new NextResponse(JSON.stringify({ message: "Missing book ID" }));

    if (!Types.ObjectId.isValid(bookId))
      return new NextResponse(JSON.stringify({ message: "Invalid book ID" }));

    await dbConnect();

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, isbn, publishYear },
      { new: true }
    );

    if (!updatedBook)
      return new NextResponse(JSON.stringify({ message: "Book not updated" }));

    return new NextResponse(
      JSON.stringify({ message: "Book updated successfully" })
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error updating book.", error })
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId)
      return new NextResponse(JSON.stringify({ message: "Missing book ID" }));

    if (!Types.ObjectId.isValid(bookId))
      return new NextResponse(JSON.stringify({ message: "Invalid book ID" }));

    await dbConnect();

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook)
      return new NextResponse(JSON.stringify({ message: "Book not deleted" }));

    return new NextResponse(
      JSON.stringify({ message: "Book deleted successfully" })
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error deleting book.", error })
    );
  }
};
