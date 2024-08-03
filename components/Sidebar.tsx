"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { usePathname } from "next/navigation";
import AddBookForm from "./AddBookForm";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  //console.log(pathname);

  return (
    <div className="px-5 pb-3 z-50 relative h-full w-full bg-zinc-900">
      <form className="flex items-center relative mt-8">
        <input
          className="pl-5 py-1 w-full rounded-full text-black"
          type="search"
          id="searchbox"
          placeholder="Search"
        />
        <button className="absolute right-2" type="submit">
          <Image src="/icons/search.svg" width={24} height={24} alt="search" />{" "}
        </button>
      </form>
      <div className="flex flex-col gap-y-1">
        <Link
          href="/"
          className={`${
            pathname === "/" && `bg-slate-700`
          } mt-3 rounded-lg pl-5`}
        >
          <div className="flex flex-row items-center py-2">
            <Image
              className="mr-4"
              src="/icons/home.svg"
              width={24}
              height={24}
              alt="home"
            />
            <p className="">Home</p>
          </div>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <div className="mt-2 pl-5 py-2 rounded-lg flex flex-row items-center hover:bg-slate-600">
              <Image
                className="mr-4"
                src="/icons/plus.svg"
                width={24}
                height={24}
                alt="add book"
              />
              <p className="">Add Book</p>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-slate-900">
            <DialogHeader>
              <DialogTitle>Add a new book to your library</DialogTitle>
              <DialogDescription>
                Choose a PDF to upload and either search it to autofill the
                fields or enter the information manually.
              </DialogDescription>
            </DialogHeader>
            <AddBookForm closeDialog={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;
