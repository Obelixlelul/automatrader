"use client";

import { useState } from "react";
import { todoInput } from "@/types";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateTodo() {
  const router = useRouter();
  const [newTodo, setNewTodo] = useState<string>("");
  const { toast } = useToast();

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setNewTodo("");
      toast({
        title: "Operaçao realizada com sucesso!",
        description: "Tarefa criada com sucesso.",
      });
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
              description: "Não foi possível criar a tarefa.",
            });
            return;
          }

          createTodo.mutate(newTodo);
        }}
      >
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          type="text"
          name="new-todo"
          id="new-todo"
          placeholder="Nova tarefa..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Create
        </button>
      </form>
    </div>
  );
}
