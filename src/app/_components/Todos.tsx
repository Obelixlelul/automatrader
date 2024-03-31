"use client";

import { api } from "@/trpc/react";
import Todo from "./Todo";

export default function Todos() {
  const { data: todos, isLoading, isError } = api.todo.all.useQuery();

  if (isLoading) return <div>Carregando tarefas...</div>;

  if (isError) return <div>Error ao carregar tarefas...</div>;

  return (
    <div className="flex flex-col gap-2  text-black">
      {todos?.length
        ? todos.map((todo) => {
            return <Todo key={todo.id} todo={todo} />;
          })
        : "Crie sua primeira tarefa."}
    </div>
  );
}
