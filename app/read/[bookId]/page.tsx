"use client";

import { Slider } from "@/components/ui/slider";
import { getBookToRead } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Document, Outline, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  //"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
  new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const maxWidth = 800;

const ReadBook = ({ params }: { params: { bookId: string } }) => {
  const bookId = params.bookId;
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [bookUrl, setBookUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(800);
  const [hideOutline, setHideOutline] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setLoading(false);
  };

  useEffect(() => {
    const getBookInfo = async () => {
      const { bookUrl, imageUrl, page } = await getBookToRead(bookId);
      setBookUrl(bookUrl);
      setImageUrl(imageUrl);
      setPageNumber(page);
    };
    getBookInfo();
  }, [bookId]);

  return (
    <main className="flex flex-col h-screen relative overflow-hidden">
      <div className="flex flex-row w-full h-16 shrink-0 bg-zinc-900">
        <Link href={`/book/${bookId}`}>back</Link>
        <p className="grow flex justify-center leading-[4rem]">
          Page {pageNumber} of {numPages}
        </p>
        <Slider
          className="w-32"
          defaultValue={[800]}
          max={1200}
          step={10}
          min={500}
          onValueChange={(val) => setPageWidth(val[0])}
        />
      </div>
      <div className="flex justify-center mx-24 overflow-scroll">
        {loading && (
          <Image
            priority
            className="h-full"
            src={imageUrl}
            alt="cover image"
            width={300}
            height={450}
          />
        )}
        <Document
          file={bookUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          <div
            className={`flex flex-row max-h-[90vh] overflow-x-visible min-h-[50vh] w-[300px] border-r py-3 
            absolute top-16 left-0 duration-200 ease-linear bg-zinc-800 z-40 ${
              hideOutline ? "-translate-x-[300px]" : "translate-x-0"
            }`}
          >
            <Outline className="pdf-contents overflow-y-scroll w-full" />
            <p
              className="absolute top-[50vh] -right-[60px] rotate-90 border-t border-x px-2.5 pt-1 bg-zinc-800 cursor-pointer"
              onClick={() => setHideOutline(!hideOutline)}
            >
              Contents
            </p>
          </div>
          {Array.from(new Array(numPages ?? 0), (el, index) => (
            <div className="flex flex-row w-full" key={`page_${index + 1}`}>
              <Page
                className="!bg-transparent relative z-0"
                pageNumber={index + 1}
                width={pageWidth}
                loading={""}
              />
              {/*<Page key={`page_${index * 2 + 2}`} pageNumber={index * 2 + 2} />*/}
            </div>
          ))}
        </Document>
      </div>
    </main>
  );
};

export default ReadBook;
