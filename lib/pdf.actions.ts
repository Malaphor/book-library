"use server";

import { pdfjs } from "react-pdf";
import { getImageName } from "./utils";

if (typeof Promise.withResolvers === "undefined") {
  if (typeof window !== "undefined") {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  } else {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    global.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
//  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
//new URL(    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",    import.meta.url  ).toString();

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

export const getFirstPageAsImage = async (url: string) => {
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

  const response = await fetch(url, {});
  const fileAsArrayBuffer = await response.arrayBuffer();

  //const fileAsArrayBuffer = await readFile(file);
  if (fileAsArrayBuffer) {
    return await convertToImage(new Uint8Array(fileAsArrayBuffer));
  }
};

export const searchForImage = async (title: string, isbn: string) => {
  try {
    let imageBlob: Blob | null = null;
    let imageFiles: string[] = [];
    let imageName = getImageName(title);
    let dataToReturn = { images: imageFiles, message: "", error: false };

    const response = await fetch(
      `https://openlibrary.org/search.json?isbn=${isbn}`,
      {}
    );

    const data = await response.json();
    console.log(data);
    const olid: string[] = [...data.docs[0].edition_key];

    if (!olid || olid.length === 0) {
      dataToReturn.message =
        "No cover image found. Try another ISBN or generate from PDF.";
      dataToReturn.error = true;
      console.log(dataToReturn);
      return;
    }

    for (let i = 0; i < olid.length; i++) {
      const url = `https://covers.openlibrary.org/b/olid/${olid[i]}.jpg`;
      const response = await fetch(url, {});

      if (response.url !== url) {
        //diff url means found image
        /*
        imageBlob = await response.blob();
        imageFiles.push(
          new File([imageBlob], `${imageName}.jpg`, {
            type: "image/jpeg",
          })
        );*/
        imageFiles.push(url);
      }
    }

    if (imageFiles.length === 0) {
      //} || !imageBlob) {
      dataToReturn.message =
        "Failed to get image. Try again or generate from PDF.";
      dataToReturn.error = true;
      console.log(dataToReturn);
      return;
    }
    console.log(dataToReturn);
    return dataToReturn;
  } catch (error) {
    console.error(error);
  }
};
