import { getServerAuthSession } from "@/server/auth";
import Todos from "./_components/Todos";
import CreateTodo from "./_components/CreateTodo";
import { Btn } from "./_components/LoginBtn";
import { Toaster } from "@/components/ui/toaster";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#9bafd9] to-[#103783] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="">Automa.trade - Task Control</h1>

        {session && (
          <div className="grid min-w-[600px] grid-cols-1 gap-4 md:gap-8">
            <div className="flex  flex-col gap-4 rounded-xl bg-white/40 p-4 text-white">
              <h3 className="text-center text-xl font-bold">
                Lista de tarefas
              </h3>
              <div className="flex h-[200px] flex-col gap-1 overflow-y-auto">
                <Todos />
              </div>
              <CreateTodo />
            </div>
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

        <CrudShowcase />
      </div>
      <Toaster />
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  // const latestPost = await api.post.getLatest();

  return <div className="w-full max-w-xs"></div>;
}
