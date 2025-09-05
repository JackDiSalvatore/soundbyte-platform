"use client";

import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { useAuth } from "@/context/AuthProvider";

export default function Header({ className }: { className: string }) {
  const { session, accessToken, isPending } = useAuth();

  return (
    <main className={`${className}`}>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Header
      </h1>

      <UserDropdownMenu user={session?.user ?? null} />
    </main>
  );
}
