"use client";

import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { User } from "better-auth/types";

export default function Header({
  user,
  className,
}: {
  user: User | null;
  className: string;
}) {
  return (
    <main className={`${className}`}>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Header
      </h1>

      <UserDropdownMenu user={user} />
    </main>
  );
}
