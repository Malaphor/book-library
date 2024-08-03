import DeleteBook from "@/components/DeleteBook";
import EditBookInfo from "@/components/EditBookInfo";
import { Button } from "@/components/ui/button";
import { getBook } from "@/lib/actions";
import { BookDocument } from "@/lib/constants";
import { getLanguage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }: { params: { bookId: string } }) => {
  const book: BookDocument = await getBook(params.bookId);

  return (
    <main className="flex min-h-screen flex-col gap-10 p-24">
      <section className="flex flex-row gap-10">
        <div className="relative group">
          <Link href={`/read/${book._id}`}>
            <div
              className="bg-black bg-opacity-35 absolute top-0 left-0 w-full h-full z-50
            invisible group-hover:visible hover:cursor-pointer flex justify-center items-center"
            >
              <div className="flex justify-center items-center w-14 h-14 rounded-full bg-gray-800 opacity-75">
                <Image
                  className="w-9 h-9 invert"
                  src="/icons/read.png"
                  alt="open book"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <Image
              src={book.imageUrl}
              alt={book.title}
              width={300}
              height={450}
              priority
            />
          </Link>
        </div>
        <div className="flex flex-col gap-2 max-w-[700px]">
          <h1 className="text-lg font-bold">{book.title}</h1>
          <p>{book.publishYear}</p>
          <div className="flex flex-row gap-8 items-center pt-5">
            <Link href={`/read/${book._id}`}>
              <Button className="bg-slate-500 hover:bg-slate-900 p-2 flex flex-row justify-around group">
                <Image
                  className="pr-3 group-hover:invert"
                  src="/icons/read.png"
                  alt="read book"
                  width={40}
                  height={40}
                />
                <p className="text-lg">Read</p>
              </Button>
            </Link>
            <div className="flex justify-center group relative">
              <Image
                className="w-[24px] invert group-hover:cursor-pointer"
                src="/icons/mark-read.png"
                alt="mark read"
                width={35}
                height={35}
              />
              <div className="absolute top-8 bg-zinc-600 rounded-md p-1.5 invisible group-hover:visible">
                <p>Mark&nbsp;read</p>
              </div>
            </div>
            <EditBookInfo book={book} />
            <DeleteBook bookId={String(book._id)} />
          </div>
          <div className="min-h-20 py-5">description</div>
          <div className="flex flex-row gap-10 flex-wrap">
            <div className="flex flex-col gap-3 basis-1/3">
              <div className="flex flex-row justify-between">
                <p className="opacity-75">Author: </p>
                <p>{book.author}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="opacity-75">Contributor(s): </p>
                <p>{book.contributors}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 basis-1/3">
              <div className="flex flex-row justify-between">
                <p className="opacity-75">Language: </p>
                <p>{getLanguage(book.lang)}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="opacity-75">File type: </p>
                <p>
                  {book.bookUrl
                    .substring(book.bookUrl.lastIndexOf(".") + 1)
                    .toUpperCase()}
                </p>
                <p className="opacity-75">Pages</p>
                <p>69</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h1 className="font-semibold text-xl mb-5">Related Books</h1>
        <div className="flex flex-row gap-10">{/* related books */}</div>
      </section>
    </main>
  );
};

export default Page;
