"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { deleteBook, navigateToHome } from "@/lib/actions";

const DeleteBook = ({ bookId }: { bookId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteBook(bookId);

      const { message, error } = response;

      if (error) {
        setDeleteMessage(message);
      } else {
        navigateToHome();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setDeleteMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex justify-center group relative">
          <Image
            className="w-[24px] invert hover:cursor-pointer"
            src="/icons/delete.png"
            alt="delete book"
            width={35}
            height={35}
          />
          <div className="absolute top-8 bg-zinc-600 rounded-md p-1.5 invisible group-hover:visible">
            <p>Delete</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-slate-900">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {deleteMessage !== "" && <p>{deleteMessage}</p>}
        <DialogFooter>
          <div className="flex flex-row w-full justify-between">
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBook;
