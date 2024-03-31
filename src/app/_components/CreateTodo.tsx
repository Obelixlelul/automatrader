"use client";

import { useState } from "react";
import { todoInput } from "@/types";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function CreateTodo() {
  // const [newTodo, setNewTodo] = useState<string>("");
  const { toast } = useToast();
  const trpc = api.useUtils();

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Operaçao realizada com sucesso!",
        description: "Tarefa criada com sucesso.",
      });
    },
    onMutate: async () => {
      await trpc.todo.all.cancel();

      const previousTodos = trpc.todo.all.getData();

      const formfields = form.getValues();

      trpc.todo.all.setData(undefined, (prev) => {
        const optmisticTodo = {
          id: "optimistic-todo-id",
          text: formfields.text,
          done: false,
          deadline: null,
        };

        if (!prev) return previousTodos;
        return [...prev, optmisticTodo];
      });

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      trpc.todo.all.setData(undefined, () => context?.previousTodos);

      toast({
        title: "Operaçao falhou",
        description: "Um erro aconteceu ao tentar criar a tarefa.",
      });
    },

    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  const formSchema = z.object({
    text: z
      .string()
      .min(1, { message: "Deve conter ao menos 1 caractere." })
      .max(50, { message: "Deve conter no máximo 50 caracteres." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    createTodo.mutate(values.text);
  }

  return (
    <Form {...form}>
      <form className="flex gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="O titulo da sua tarefa"
                  {...field}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          Criar
        </Button>
      </form>
    </Form>
  );
}
