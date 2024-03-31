"use client";

import { type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Todo } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { pt, ptBR } from "date-fns/locale";

type DialogEditTodoProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  text: string;
  id: string;
};

export default function DialogEditTodo({
  open,
  onOpenChange,
  text,
  id,
}: DialogEditTodoProps) {
  const trpc = api.useUtils();
  const { toast } = useToast();

  const editTodo = api.todo.edit.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      toast({
        title: "Operaçao realizada",
        description: "Tarefa alterada com sucesso",
      });
    },

    onMutate: async ({ id, text, deadline }) => {
      await trpc.todo.all.cancel();

      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;

        return prev.map((t) => {
          if (t.id === id) {
            return { ...t, text, deadline };
          }
          return t;
        });
      });

      return { previousTodos };
    },

    onError: (wee, newTodo, context) => {
      toast({
        title: "Operaçao falhou",
        description: "Um erro ocorreu ao tentar editar a tarefa.",
      });
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },
  });

  const onSubmitEditTask = () => {
    const values = form.getValues();

    console.log("values = ", values);

    // const text = values.text;
    // const deadline = values.deadline;

    // editTodo.mutate({ id, text: values.text, deadline });
  };

  const formSchema = z.object({
    text: z
      .string()
      .min(1, { message: "Deve conter ao menos 1 caractere." })
      .max(50, { message: "Deve conter no máximo 50 caracteres." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: text,
      deadline: null,
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
        onOpenChange(false);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edição de tarefa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmitEditTask)}
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarefa</FormLabel>
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

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data limite</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-[240px] pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
              >
                Salvar alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
