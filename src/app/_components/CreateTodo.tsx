"use client";

import { useState } from "react";
import { todoInput } from "@/types";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateTodo() {
  const [newTodo, setNewTodo] = useState<string>("");
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

      trpc.todo.all.setData(undefined, (prev) => {
        const optmisticTodo = {
          id: "optimistic-todo-id",
          text: newTodo,
          done: false,
        };

        if (!prev) return previousTodos;
        return [...prev, optmisticTodo];
      });

      setNewTodo("");
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      setNewTodo(newTodo);

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

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const result = todoInput.safeParse(newTodo);

          if (!result.success) {
            toast({
              title: "Operaçao falhou",
              description:
                "O titulo da task deve conter entre 1 e 50 caracteres.",
            });
            return;
          }

          createTodo.mutate(newTodo);
        }}
      >
        <Input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          type="text"
          name="new-todo"
          id="new-todo"
          placeholder="Nova tarefa..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
          Create
        </Button>
      </form>
    </div>
  );
}
