import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { todoInput } from "@/types";

export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos: {
      id: string;
      text: string;
      done: boolean;
      deadline: Date | null;
    }[] = await ctx.db.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });

    return todos.map(({ id, text, done, deadline }) => ({
      id,
      text,
      done,
      deadline,
    }));
  }),

  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input,
          done: false,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  toggle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input: { id, done } }) => {
      return ctx.db.todo.update({
        where: {
          id,
        },
        data: {
          done,
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
        deadline: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input: { id, text, deadline } }) => {
      return ctx.db.todo.update({
        where: {
          id,
        },
        data: {
          text,
          deadline,
        },
      });
    }),
});
