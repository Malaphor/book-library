"use client";

import { EditBookProps } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useState } from "react";
import { pdfjs } from "react-pdf";
import { DialogClose } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { searchForImage } from "@/lib/pdf.actions";
import Image from "next/image";
import { updateBookImage } from "@/lib/actions";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type CoverImageType = "generate" | "search";

const EditCoverImage = ({ book, closeDialog }: EditBookProps) => {
  const [coverImageType, setCoverImageType] =
    useState<CoverImageType>("generate");
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [editMessage, setEditMessage] = useState<string | undefined>(undefined);

  const handleGetImages = async () => {
    setIsLoading(true);
    try {
      if (coverImageType === "generate") {
        //
      } else {
        const result = await searchForImage(book.title, book.isbn);

        if (!result) {
          setEditMessage("Image search failed");
          return;
        }
        console.log(result);

        if (result.error) {
          setEditMessage(result.message);
          return;
        }

        setImages([...result.images]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImage = (image: string) => {
    if (selectedImage === image) {
      setSelectedImage("");
    } else {
      setSelectedImage(image);
    }
  };

  const handleUpdateImage = async () => {
    setIsUpLoading(true);
    try {
      const response = await updateBookImage(
        selectedImage,
        book.title,
        String(book._id)
      );

      if (!response) throw new Error();

      if (response.error) {
        setEditMessage(response.message);
      } else {
        closeDialog();
      }
    } catch (error) {
      console.error(error);
      setEditMessage("Error updating image. Try again later.");
    } finally {
      setIsUpLoading(false);
    }
  };

  return (
    <div>
      <div className="my-2">
        <RadioGroup
          className="flex flex-row gap-8 mb-5"
          defaultValue="generate"
          onValueChange={(value) => setCoverImageType(value as CoverImageType)}
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
            <RadioGroupItem className="bg-white" value="search" id="search" />
            <Label htmlFor="search">Search for image</Label>
          </div>
        </RadioGroup>
        <Button
          className="border-[1px] border-gray-500"
          type="button"
          onClick={handleGetImages}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Working..." : "Get images"}
        </Button>
        {editMessage && <p className="my-2">{editMessage}</p>}
      </div>
      {/*<div>
        <p>Current Image</p>
        <div className="h-48">
          <Image
            className="h-full w-auto"
            src={book.imageUrl}
            alt="current cover image"
            width={300}
            height={450}
          />
        </div>
      </div>*/}
      {images.length > 0 && (
        <div className="my-4">
          <p className="mb-3">Select New Image</p>
          <div className="flex flex-row flex-wrap gap-2 max-h-80 overflow-y-scroll">
            {images.map((image) => {
              return (
                <div
                  className="h-48 relative group cursor-pointer"
                  key={image}
                  onClick={() => handleSelectImage(image)}
                >
                  {selectedImage === image && (
                    <div
                      className="bg-black bg-opacity-35 absolute top-0 left-0 w-full h-full z-50
                                flex justify-center items-center"
                    >
                      <div className="flex justify-center items-center w-14 h-14 rounded-full bg-gray-800 opacity-75">
                        <Image
                          className="w-9 h-9 invert"
                          src="/icons/check-mark.png"
                          alt="selected"
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                  )}
                  <Image
                    className="rounded-md h-full w-auto"
                    src={image}
                    alt="current cover image"
                    width={300}
                    height={450}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between">
        <DialogClose asChild>
          <Button type="button">Cancel</Button>
        </DialogClose>
        <Button
          type="button"
          variant="secondary"
          disabled={isLoading || isUpLoading || selectedImage === ""}
          onClick={handleUpdateImage}
        >
          {isUpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpLoading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
};

export default EditCoverImage;
