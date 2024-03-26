import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type allTodosOutputs = RouterOutputs["todo"]["all"];

export type Todo = allTodosOutputs[number];

export const todoInput = z
  .string({
    required_error: "Descreva sua tarefa.",
  })
  .min(1, { message: "A descrição deve ter no mínimo 1 caracteres." })
  .max(50, { message: "A descrição deve ter no máximo 50 caracteres." });
