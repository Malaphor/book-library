This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Book Library

At present, this project only supports uploading and viewing PDF files.

## Technologies used

[React-PDF](https://www.npmjs.com/package/react-pdf), a React compatable package used to display PDFs which is based on the PDF.js library by Mozilla
[MongoDB](https://www.mongodb.com/) for storing data about books (title, author, urls to the book and cover image files, etc)
[UploadThing](https://uploadthing.com/) for storing the book and cover image files
[Shadcn](https://ui.shadcn.com/) - a collection of reusable components to help build the UI
[OpenLibrary](https://openlibrary.org/dev/docs/api/search) API to search for book information by ISBN, if available
