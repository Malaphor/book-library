"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
import EditBookForm from "./EditBookForm";
import { BookDocument } from "@/lib/constants";

const EditBookInfo = ({ book }: { book: BookDocument }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex justify-center group relative">
          <Image
            className="w-[24px] invert hover:cursor-pointer"
            src="/icons/edit.png"
            alt="edit book info"
            width={35}
            height={35}
          />
          <div className="absolute top-8 bg-zinc-600 rounded-md p-1.5 invisible group-hover:visible">
            <p>Edit&nbsp;info</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-slate-900">
        <DialogHeader>
          <DialogTitle>Update book information</DialogTitle>
        </DialogHeader>
        <EditBookForm book={book} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditBookInfo;
