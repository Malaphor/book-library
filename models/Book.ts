import mongoose, { Document, Schema } from "mongoose";

export interface BookInterface extends Document {
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  bookUrl: string;
  imageUrl: string;
  contributors?: string;
  lang?: string;
  numPages: number;
}

const bookSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  publishYear: { type: Number, required: true },
  bookUrl: { type: String, required: true },
  imageUrl: { type: String, required: true },
  contributors: { type: String },
  lang: { type: String },
  numPages: { type: Number, required: true },
});

const Book =
  mongoose.models.Book || mongoose.model<BookInterface>("Book", bookSchema);

export default Book;
