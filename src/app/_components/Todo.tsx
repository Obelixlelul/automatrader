"use client";

import { api } from "@/trpc/react";
import type { Todo } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Alert from "./Alert/Alert";
import { useState } from "react";
import DialogEditTodo from "./DialogEditTodo/DialogEditTodo";
import { format, isPast, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: TodoProps) {
  const { id, text, done, deadline } = todo;
  const router = useRouter();
  const { toast } = useToast();
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

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

  const date = deadline ? format(deadline, "P", { locale: ptBR }) : null;

  const taskLate = () => {
    if (date) {
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());
      return isPast(parsedDate);
    }
    return null;
  };

  return (
    <>
      {openDeleteAlert && (
        <Alert
          description="Ao confirmar você irá deletar a tarefa"
          title="Tem certeza disso?"
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          cbConfirm={() => deleteTodo.mutate(id)}
        />
      )}

      {openEditDialog && (
        <DialogEditTodo
          id={id}
          text={text}
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          deadline={deadline}
        />
      )}

      <div
        className={`flex w-full flex-col  items-center justify-between gap-1 rounded-lg bg-white p-2 px-4 hover:bg-slate-50 ${done ? "bg-green-100 hover:bg-green-100" : ""}`}
      >
        <div className="flex w-full items-center gap-2 ">
          <Checkbox
            className="focus:ring-3 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            name="done"
            id="done"
            checked={done}
            onCheckedChange={(checked) => {
              toggleTodo.mutate({ id, done: checked as boolean });
            }}
          />

          <span
            className={`cursos-pointer ${done ? "line-through" : ""} break-all`}
          >
            {text}
          </span>
        </div>

        <div className="flex w-full items-center justify-between ">
          <div className="tempclass">
            <span className="text-center text-xs font-semibold">
              Previsão: {date ?? "Não definida"}
            </span>
            <span className="text-red-600">
              {taskLate() && !done && (
                <span className="text-xs">(atrasado)</span>
              )}
            </span>
          </div>

          <div className="align-center  flex justify-end  gap-1">
            <span
              onClick={() => {
                setOpenEditDialog(true);
              }}
              className="flex cursor-pointer items-center justify-center text-base leading-none hover:text-neutral-700"
            >
              Editar
            </span>

            <span className="flex cursor-pointer items-center justify-center text-base leading-none">
              |
            </span>

            <span
              onClick={() => {
                setOpenDeleteAlert(true);
              }}
              className="flex cursor-pointer items-center justify-center text-base leading-none hover:text-neutral-700"
            >
              Excluir
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
