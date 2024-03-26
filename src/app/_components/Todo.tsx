"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Todo } from "@/types";
import { DeleteFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: TodoProps) {
  const { id, text, done } = todo;
  const router = useRouter();
  const { toast } = useToast();

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Operaçao falhou",
        description: "Um erro ocorreu ao tentar deletar a tarefa.",
      });
    },
  });

  const toggleTodo = api.todo.toggle.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Operaçao falhou",
        description: "Um erro ocorreu ao tentar marcar a tarefa.",
      });
    },
  });

  return (
    <>
      <div className="flex w-full items-center justify-between p-2 px-4 hover:bg-white/30">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center gap-2 ">
            <input
              className="focus:ring-3 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              type="checkbox"
              name="done"
              id="done"
              checked={done}
              onChange={(e) => {
                toggleTodo.mutate({ id, done: e.target.checked });
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
          className="w-full rounded-lg bg-blue-700 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            deleteTodo.mutate(id);
          }}
        >
          <DeleteFilled />
        </Button>
      </div>
    </>
  );
}
