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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import EditCoverImage from "./EditCoverImage";

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
        <Tabs defaultValue="info">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="basis-1/2">
              General
            </TabsTrigger>
            <TabsTrigger value="image" className="basis-1/2">
              Image
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <EditBookForm book={book} closeDialog={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="image">
            <EditCoverImage book={book} closeDialog={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookInfo;
