import { BookCoverProps } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BookCover = ({
  imageUrl,
  title,
  author,
  year,
  bookId,
}: BookCoverProps) => {
  return (
    <div>
      <Link href={`/book/${bookId}`}>
        <div className="relative mb-2 group">
          <div
            className="bg-black bg-opacity-35 absolute top-0 left-0 w-full h-full z-50
            invisible group-hover:visible hover:cursor-pointer flex justify-center items-center"
          >
            <div className="flex justify-center items-center w-14 h-14 rounded-full bg-gray-800 opacity-75">
              <Image
                className="w-9 h-9 invert"
                src="/icons/book.png"
                alt="open book"
                width={40}
                height={40}
              />
            </div>
          </div>

          <Image
            className="rounded-md object-contain object-center"
            src={imageUrl}
            alt={title}
            width={300}
            height={450}
          />
        </div>
      </Link>
      <div className="flex flex-col justify-between text-sm">
        <Link
          href={`/book/${bookId}`}
          className="text-ellipsis line-clamp-1 mb-1 hover:underline"
        >
          {title}
        </Link>
        <p className="text-ellipsis line-clamp-1 mb-1">{author}</p>
        <p className="text-gray-500">{year}</p>
      </div>
    </div>
  );
};

export default BookCover;
