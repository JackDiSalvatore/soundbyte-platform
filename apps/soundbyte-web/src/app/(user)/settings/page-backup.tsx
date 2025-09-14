"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { env } from "@/lib/environment";
import axios from "axios";
import { useEffect, useState } from "react";

const availableStreamingProviders = ["spotify", "soundcloud"];

export default function Page() {
  const { session, streamingCredentials, isPending } = useAuth();
  const userId = session?.user.id;

  const [connectedStreamingProviders, setConnectedStreamingProviders] =
    useState<string[] | null>(null);

  // StreaminCredentials are a side effect state comming from the streaming-provider-api
  useEffect(() => {
    if (!streamingCredentials) return;

    const providers: string[] = [];

    console.log("Connected to:");

    for (let cred of streamingCredentials) {
      console.log(cred.provider);
      providers.push(cred.provider);
    }

    setConnectedStreamingProviders(providers);
  }, [streamingCredentials]);

  async function connectStreamingProvider(provider: string) {
    const res = await axios.post(
      `${env.NEXT_PUBLIC_STREAMING_API}/connect/userId/${userId}/provider/${provider}`,
      {
        provider,
        userId,
      }
    );
  }

  async function disconnectStreamingProvider(provider: string) {
    const res = await axios.post(
      `${env.NEXT_PUBLIC_STREAMING_API}/disconnect/userId/${userId}/provider/${provider}`,
      {
        provider,
        userId,
      }
    );
  }

  return (
    <main className="flex flex-col m-2">
      <div className="flex flex-col justify-between gap-2 mb-4">
        <h1 className="text-xl font-semibold mb-4">Settings</h1>
        <p>Connect a streaming provider:</p>
      </div>

      <div className="flex flex-col justify-between gap-2">
        <ul>
          {availableStreamingProviders.map((item, index) => (
            <li key={index}>
              {!connectedStreamingProviders?.includes(item) ? (
                <Button
                  className="w-1/2 bg-green-500 hover:bg-green-300 text-black py-2 px-4 rounded"
                  onClick={() => disconnectStreamingProvider(item)}
                >
                  Connect {item}
                </Button>
              ) : (
                <Button
                  className="w-1/2 bg-gray-500 hover:bg-gray-300 text-white py-2 px-4 rounded"
                  onClick={() => connectStreamingProvider(item)}
                >
                  Disconnect {item}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
