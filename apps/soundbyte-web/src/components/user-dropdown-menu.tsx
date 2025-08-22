"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { User } from "better-auth/types";
import SignOut from "./sign-out";

export function UserDropdownMenu({ user }: { user: User | null }) {
  const img = user?.image ?? "https://github.com/shadcn.png";
  const name = user?.name ?? "--";
  const fullName: string[] = name.split(/\s/, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={`${img}`} alt="@shadcn" />
          <AvatarFallback>{fullName[0][0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>{fullName[0]}'s Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={"/library"}>Library</Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href={"/settings"}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <SignOut className="w-full bg-white text-black hover:bg-black hover:text-red-500" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
