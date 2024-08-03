"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { pdfjs } from "react-pdf";
import {
  type TextItem,
  type TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import { getImageName, isValidIsbn, isbnRegex } from "@/lib/utils";
import { DialogClose } from "./ui/dialog";
import {
  AddBookFormProps,
  ApiResponse,
  addBookFormSchema,
} from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2 } from "lucide-react";
import { navigateToHome } from "@/lib/actions";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
/* new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();*/

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const AddBookForm = ({ closeDialog }: AddBookFormProps) => {
  const form = useForm<z.infer<typeof addBookFormSchema>>({
    resolver: zodResolver(addBookFormSchema),
    defaultValues: {
      bookFile: undefined,
      title: "",
      author: "",
      isbn: "",
      publishYear: "",
      olid: [""],
    },
  });
  const fileRef = form.register("bookFile");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parseMessage, setParseMessage] = useState<string | undefined>(
    undefined
  );
  const [coverImageType, setCoverImageType] = useState("generate");
  const [isbnSearch, setIsbnSearch] = useState("auto");
  const [manualIsbn, setManualIsbn] = useState("");
  const [extraBookInfo, setExtraBookInfo] = useState({
    contributors: [],
    lang: "",
    pages: -1,
  });
  const hyphenRegex = /[-|‒|–|−]+/g;
  const pagesToSearch = 6;

  const searchBookInfo = async (isbn: string) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?isbn=${isbn}`,
        {}
      );

      const data = await response.json();

      if (data.numFound === 0) {
        setParseMessage(
          "Couldn't find any book information. Try a different ISBN or enter information manually."
        );
      }

      let contributors;
      if (data.docs[0].contributor && data.docs[0].contributor.length > 0) {
        contributors = data.docs[0].contributor.join(",");
      } else {
        contributors = "";
      }

      //console.log(data);
      form.setValue("title", data.docs[0].title);
      form.setValue("author", data.docs[0].author_name[0]);
      form.setValue("isbn", isbn);
      form.setValue("publishYear", "" + data.docs[0].first_publish_year);
      form.setValue("olid", data.docs[0].edition_key);
      setExtraBookInfo({
        contributors: contributors,
        lang: data.docs[0].language.join(""),
        pages: data.docs[0].number_of_pages_median,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const searchForIsbn = async (typedArray: Uint8Array) => {
    const isTextItem = (obj: TextItem | TextMarkedContent): obj is TextItem => {
      return "str" in obj;
    };

    const pdf = await pdfjs.getDocument(typedArray).promise;
    setExtraBookInfo({ ...extraBookInfo, pages: pdf.numPages });

    for (let i = 1; i < pagesToSearch + 1; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      let textWithIsbn: string[] = [];

      for (let j = 0; j < textContent.items.length; j++) {
        const item = textContent.items[j];
        if (isTextItem(item)) {
          if (item.str.includes("ISBN")) {
            //some books have TextItems between ISBN and the number so we grab the whole line
            for (let k = 0; k < 5; k++) {
              textWithIsbn.push(textContent.items[j + k].str);
              if (textContent.items[j + k].hasEOL === true) break;
            }
            //some books have extra spaces or '' after the number so we filter all that shit out
            const textToReturn = textWithIsbn.filter(
              (text) => text !== " " && text !== ""
            );
            //console.log("returned", textToReturn);
            return textToReturn.join(" ");
            //return item.str;
          }
        }
      }
    }
    return undefined;
  };

  const handleParseBook = async () => {
    setIsLoading(true);
    setParseMessage(undefined);

    if (isbnSearch === "manual") {
      try {
        const isbn = manualIsbn.replaceAll(hyphenRegex, "");
        if (!isbn.match(isbnRegex)) {
          setParseMessage(
            "Invalid ISBN. Must be a valid 10 or 13 character ISBN."
          );
          throw Error();
        }
        await searchBookInfo(isbn);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const filelist = form.getValues("bookFile");

    if (!filelist[0]) {
      setParseMessage("Choose a book to add to the library.");
      setIsLoading(false);
      return;
    }
    try {
      const fileArrayBuffer = await readFile(filelist[0]);
      const fileDataArray = new Uint8Array(fileArrayBuffer as ArrayBuffer);

      const textWithIsbn = await searchForIsbn(fileDataArray);

      if (!textWithIsbn) {
        setParseMessage("Invalid or missing ISBN in the PDF.");
        return;
      }

      const splitText = textWithIsbn.split(" ");
      const isbn = splitText[splitText.length - 1].replaceAll(hyphenRegex, "");

      if (isValidIsbn(isbn)) {
        await searchBookInfo(isbn);
      } else {
        setParseMessage("Invalid or missing ISBN in the PDF.");
        return;
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : (error as string);
      setParseMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const readFile = (file: File) => {
    return new Promise<ArrayBuffer | null>((resolve) => {
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        resolve(fileReader.result as ArrayBuffer);
      };

      fileReader.onerror = () => {
        console.error("Error reading file");
        return null;
      };

      fileReader.readAsArrayBuffer(file as File);
    });
  };

  const getFirstPageAsImage = async (file: File) => {
    const convertToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        });
      });
    };

    const convertToImage = async (typedArray: Uint8Array) => {
      try {
        const pdf = await pdfjs.getDocument(typedArray).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          const renderContext = { canvasContext: ctx, viewport: viewport };

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render(renderContext).promise;
          const dataBlob = await convertToBlob(canvas);
          //return new File([dataBlob], "coverImage.png");
          return {
            data: dataBlob,
            width: "" + viewport.width,
            height: "" + viewport.height,
          };
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fileAsArrayBuffer = await readFile(file);
    if (fileAsArrayBuffer) {
      return await convertToImage(new Uint8Array(fileAsArrayBuffer));
    }
  };

  const onSubmit = async (data: z.infer<typeof addBookFormSchema>) => {
    setIsUploading(true);
    setParseMessage("");

    let imageFile;
    let imageBlob;
    const imageName = getImageName(data.bookFile[0].name);

    if (coverImageType === "generate") {
      const imageData = await getFirstPageAsImage(data.bookFile[0]);

      if (!imageData) {
        setParseMessage("Failed to generate cover image.");
        return;
      }

      imageBlob = imageData.data;
      imageFile = new File([imageData.data], `${imageName}.png`, {
        type: "image/png",
      });
    } else {
      if (!data.olid) {
        setParseMessage(
          "No cover image found. Try another ISBN or generate from PDF."
        );
        return;
      }

      for (let i = 0; i < data.olid.length; i++) {
        const url = `https://covers.openlibrary.org/b/olid/${data.olid[i]}.jpg`;
        const response = await fetch(url, {});

        if (response.url !== url) {
          //diff url means found image
          imageBlob = await response.blob();
          imageFile = new File([imageBlob], `${imageName}.jpg`, {
            type: "image/jpeg",
          });
        }
      }

      if (!imageFile || !imageBlob) {
        setParseMessage("Failed to get image. Try again or generate from PDF.");
        return;
      }
    }

    if (extraBookInfo.pages === -1) {
      const fileArrayBuffer = await readFile(data.bookFile[0]);
      const fileDataArray = new Uint8Array(fileArrayBuffer as ArrayBuffer);
      const pdf = await pdfjs.getDocument(fileDataArray).promise;
      setExtraBookInfo({ ...extraBookInfo, pages: pdf.numPages });
    }
    console.log(extraBookInfo.lang);
    if (extraBookInfo.lang === undefined)
      setExtraBookInfo({ ...extraBookInfo, lang: "" });

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("isbn", data.isbn);
    formData.append("publishYear", data.publishYear);
    formData.append("bookFile", data.bookFile[0]);
    formData.append("image", imageBlob);
    formData.append("extra", JSON.stringify(extraBookInfo));

    const response = await fetch("/api/books", {
      method: "POST",
      body: formData,
    });

    const { message, error }: ApiResponse = await response.json();
    setIsUploading(false);
    if (error) {
      setParseMessage(message);
    } else {
      navigateToHome();
      closeDialog();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 text-white"
      >
        <div className="flex flex-row justify-between gap-3">
          <FormField
            control={form.control}
            name="bookFile"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      className="file:text-white bg-slate-950"
                      type="file"
                      accept=".pdf, .epub"
                      multiple={false}
                      {...fileRef}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("title", "");
                        form.setValue("author", "");
                        form.setValue("isbn", "");
                        form.setValue("publishYear", "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            className="border-[1px] border-gray-500"
            type="button"
            onClick={handleParseBook}
          >
            {isLoading ? "Searching..." : "Search for info"}
          </Button>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Options</AccordionTrigger>
            <AccordionContent>
              <Label>Cover Image</Label>
              <RadioGroup
                className="flex flex-row gap-8 mb-5"
                defaultValue="generate"
                onValueChange={(value) => setCoverImageType(value)}
              >
                <div className="flex items-center space-x-2 mt-2.5">
                  <RadioGroupItem
                    className="bg-white"
                    value="generate"
                    id="generate"
                  />
                  <Label htmlFor="generate">Generate from PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    className="bg-white"
                    value="search"
                    id="search"
                  />
                  <Label htmlFor="search">Search for image</Label>
                </div>
              </RadioGroup>
              <Label>Search by ISBN</Label>
              <RadioGroup
                className="flex flex-ro justify-evenly"
                defaultValue="auto"
                onValueChange={(value) => setIsbnSearch(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem className="bg-white" value="auto" id="auto" />
                  <Label htmlFor="auto">Scan PDF</Label>
                </div>
                <div className="flex flex-row gap-3 justify-evenly">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      className="bg-white"
                      value="manual"
                      id="manual"
                    />
                    <Label htmlFor="manual">Enter&nbsp;manually:</Label>
                  </div>
                  <Input
                    className="bg-slate-950"
                    placeholder="ISBN"
                    disabled={isbnSearch === "auto"}
                    value={manualIsbn}
                    onChange={(e) => setManualIsbn(e.target.value)}
                  />
                </div>
              </RadioGroup>
              <p className="w-full text-center mt-3 font-semibold">
                Press "Search for info" to apply changes
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {parseMessage && <p className="text-red-700">{parseMessage}</p>}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="bg-slate-950"
                  placeholder="Title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input
                  className="bg-slate-950"
                  placeholder="Author"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-3">
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-950"
                    placeholder="ISBN"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publishYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Published</FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-950"
                    placeholder="(eg 2012)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="olid"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row justify-between">
          <DialogClose asChild>
            <Button type="button">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="secondary"
            disabled={isUploading || isLoading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? "Adding to library..." : "Add To Library"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddBookForm;
