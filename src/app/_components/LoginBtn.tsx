"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "@/components/ui/use-toast";

function LoginBtn() {
  const [loading, setLoading] = useState(false);

  const handleLoading = useCallback(async () => {
    try {
      setLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      toast({
        title: "Operaçao falhou",
        description: "Um erro ocorreu ao tentar logar no sistema.",
      });
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <Button
        className="flex w-full gap-2 rounded-lg bg-black px-2 py-1 text-center text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800 sm:w-auto"
        onClick={() => handleLoading()}
      >
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        <span>Login com Google </span>
      </Button>
    </div>
  );
}

function LogoutBtn() {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <Button
        className="flex w-full gap-2 rounded-lg bg-black px-2 py-1 text-center text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800 sm:w-auto"
        onClick={async () => {
          setLoading(true);
          await signOut();
        }}
      >
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        <span>Sair</span>
      </Button>
    </div>
  );
}

export const components = {
  login: LoginBtn,
  logout: LogoutBtn,
};

type Status = keyof typeof components;

export function Btn({ status }: { status: Status }) {
  const ComponentToRender = components[status] || null;
  return (
    <div>
      <ComponentToRender />
    </div>
  );
}
