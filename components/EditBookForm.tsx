"use client";

import { DialogClose } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditBookProps, editBookFormSchema } from "@/lib/constants";
import { updateBookInfo } from "@/lib/actions";
import { getLanguage, languages } from "@/lib/utils";
import { useRouter } from "next/navigation";

const EditBookForm = ({ book, closeDialog }: EditBookProps) => {
  const router = useRouter();
  const [editMessage, setEditMessage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const currentLang = getLanguage(book.lang);

  const form = useForm<z.infer<typeof editBookFormSchema>>({
    resolver: zodResolver(editBookFormSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishYear: String(book.publishYear),
      contributors: book.contributors?.join(" / ") ?? "",
      lang: currentLang === "Unknown" ? "en" : book.lang,
    },
  });

  const onSubmit = async (data: z.infer<typeof editBookFormSchema>) => {
    setIsLoading(true);
    setEditMessage(undefined);
    //console.log(data);

    let contributors: string[];
    if (data.contributors.length > 0) {
      contributors = data.contributors.split("/").map((line) => line.trim());
    } else {
      contributors = [];
    }

    const bookData = {
      ...data,
      id: book._id,
      publishYear: Number(data.publishYear),
      contributors: contributors,
    };
    try {
      const response = await updateBookInfo(bookData);

      const { message, error } = response;

      if (error) {
        setEditMessage(message);
      } else {
        closeDialog();
        router.push(`/book/${book._id}`);
      }
    } catch (error) {
      console.error(error);
      setEditMessage("Failed to update book. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 text-white"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {editMessage && <p className="text-red-700">{editMessage}</p>}
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
          name="contributors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contributors</FormLabel>
              <FormControl>
                <Input
                  className="bg-slate-950"
                  placeholder="Separated / by / slash"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-950">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-950 text-white">
                  {languages.map((language) => {
                    return (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex flex-row justify-between">
          <DialogClose asChild>
            <Button type="button">Cancel</Button>
          </DialogClose>
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditBookForm;
