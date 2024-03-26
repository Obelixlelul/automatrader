import { api } from "@/trpc/server";
import Todo from "./Todo";

export default async function Todos() {
  const todos = await api.todo.all();

  // if (isLoading) return <div>Loading todos...</div>;

  // if (isError) return <div>Error fetching todos...</div>;

  return (
    <>
      {todos?.length
        ? todos.map((todo) => {
            return <Todo key={todo.id} todo={todo} />;
          })
        : "Create your first todo"}
    </>
  );
}
