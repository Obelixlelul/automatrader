"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Todo } from "@/types";
import { DeleteFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ReloadIcon } from "@radix-ui/react-icons";

type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: TodoProps) {
  const { id, text, done } = todo;
  const router = useRouter();
  const { toast } = useToast();

  const trpc = api.useUtils();

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Operaçao realizada com sucesso!",
        description: "Tarefa excluída com sucesso.",
      });
    },

    onMutate: async (deleteId) => {
      await trpc.todo.all.cancel();

      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;

        return prev.filter((t) => t.id !== deleteId);
      });

      return { previousTodos };
    },

    onError: (wee, newTodo, context) => {
      toast({
        title: "Operaçao falhou",
        description: "Um erro ocorreu ao tentar deletar a tarefa.",
      });
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },

    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  const toggleTodo = api.todo.toggle.useMutation({
    onSuccess: () => {
      router.refresh();
    },

    onMutate: async ({ id, done }) => {
      await trpc.todo.all.cancel();

      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;

        return prev.map((t) => {
          if (t.id === id) {
            return { ...t, done };
          }
          return t;
        });
      });

      return { previousTodos };
    },

    onError: (wee, newTodo, context) => {
      toast({
        title: "Operaçao falhou",
        description: "Um erro ocorreu ao tentar deletar a tarefa.",
      });
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },
  });

  return (
    <>
      <div className="flex w-full items-center justify-between p-2 px-4 hover:bg-white/30">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center gap-2 ">
            <Checkbox
              className="focus:ring-3 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              name="done"
              id="done"
              checked={done}
              onCheckedChange={(checked) => {
                toggleTodo.mutate({ id, done: checked as boolean });
              }}
            />

            <label
              htmlFor="done"
              className={`cursos-pointer ${done ? "line-through" : ""}`}
            >
              {text}
            </label>
          </div>
        </div>
        <Button
          className="w-full rounded-lg bg-blue-700 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          onClick={async () => {
            deleteTodo.mutate(id);
          }}
        >
          {deleteTodo.isPending && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          {!deleteTodo.isPending && <DeleteFilled />}
        </Button>
      </div>
    </>
  );
}
