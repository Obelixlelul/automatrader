"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { GoogleOutlined } from "@ant-design/icons";

function LoginBtn() {
  return (
    <div>
      <Button
        className="flex w-full gap-2 rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <GoogleOutlined />
        <span>Login com Google </span>
      </Button>
    </div>
  );
}

function LogoutBtn() {
  return (
    <div>
      <Button
        className="flex w-full gap-2 rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => signOut()}
      >
        Sair
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
