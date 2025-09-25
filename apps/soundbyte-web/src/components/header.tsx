"use client";

import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { useAuth } from "@/context/AuthProvider";

type HeaderProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function Header({ className, children }: HeaderProps) {
  const { session, isPending } = useAuth();

  return (
    <main className={`${className}`}>
      <div className="flex items-center justify-between w-full">
        {/* Left side: Logo / Nav */}
        <div className="flex items-center space-x-4">
          <span className="font-bold">My App</span>
        </div>

        {/* Middle: children (like search input) */}
        <div className="flex-1 flex justify-center">{children}</div>

        {/* Right side: user / actions */}
        <div className="flex items-center space-x-4">
          <UserDropdownMenu user={session?.user ?? null} />
        </div>
      </div>
    </main>
  );
}
