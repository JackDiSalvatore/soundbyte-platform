"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SignIn({
  socialProvider,
  className,
}: {
  socialProvider: string;
  className: string;
}) {
  if (socialProvider !== "google")
    throw new Error("Unsupported OAuth provider!");

  const [buttonText, setButtonText] = useState(
    `Sign in with ${socialProvider.charAt(0).toUpperCase() + socialProvider.slice(1)}`
  );

  async function signInWithSocial(provider: string) {
    console.log(`siging into: ${socialProvider}`);

    try {
      setButtonText("Signing in ...");

      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error(`Error: ${error}`);
      throw error;
    }
  }

  return (
    <Button
      onClick={() => signInWithSocial(socialProvider)}
      className={className}
    >
      {buttonText}
    </Button>
  );
}
