"use client";

import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  Dialog,
} from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import SignIn from "./sign-in";

export default function SignInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px] p-4 rounded-sm border-1 mt-4 bg-gray-50"
        aria-describedby="user-login"
      >
        <DialogHeader className="mb-4 items-start">
          <DialogTitle className="text-black font-medium">
            Sign in to Your Account
          </DialogTitle>
        </DialogHeader>

        <div className="grid">
          <SignIn
            socialProvider="google"
            className="w-full bg-blue-500 hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded mb-4"
          />

          {/* <SignIn socialProvider="facebook" /> */}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
