import { getServerAuthSession } from "@/server/auth";
import Todos from "./_components/Todos";
import CreateTodo from "./_components/CreateTodo";
import { Btn } from "./_components/LoginBtn";
import { Toaster } from "@/components/ui/toaster";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-600 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 py-16">
        <h1 className="">Automa.trade - Task Control</h1>

        {session && (
          <div className="container  mx-auto flex flex-col gap-6 rounded-lg bg-slate-400 px-6 py-6">
            <h3 className="text-center text-xl font-bold">Lista de tarefas</h3>

            <div className="flex h-[400px] flex-col gap-1 overflow-y-auto px-2">
              <Todos />
            </div>
            <CreateTodo />
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logado como {session.user?.email}</span>}
            </p>

            {!session && <Btn status="login" />}
            {session && <Btn status="logout" />}
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
}
