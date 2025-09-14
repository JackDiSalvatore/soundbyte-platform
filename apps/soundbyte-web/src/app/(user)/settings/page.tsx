"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { env } from "@/lib/environment";
import axios from "axios";
import { useEffect, useState } from "react";
import { StreamingProviderOAuthClient } from "./streaming-provider-oauth-client";

// const availableStreamingProviders = ["spotify", "soundcloud"];
const availableStreamingProviders = ["spotify"];

export default function Page() {
  const { session, streamingCredentials, isPending } = useAuth();
  const userId = session?.user.id;

  const [connectedStreamingProviders, setConnectedStreamingProviders] =
    useState<string[] | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Handle OAuth return on component mount
  useEffect(() => {
    const oauthResult = StreamingProviderOAuthClient.handleOAuthReturn();

    if (oauthResult.success && oauthResult.provider) {
      setNotification({
        type: "success",
        message: `Successfully connected to ${oauthResult.provider}!`,
      });

      // Refresh the streaming credentials
      // This should trigger your AuthProvider to refetch data
      // window.location.reload(); // Or call your refresh method
    } else if (oauthResult.error) {
      setNotification({
        type: "error",
        message: `Connection failed: ${oauthResult.error}`,
      });
    }
  }, []);

  // StreamingCredentials are a side effect state coming from the streaming-provider-api
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

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function connectStreamingProvider(provider: string) {
    if (!userId) {
      setNotification({
        type: "error",
        message: "Please log in to connect streaming providers",
      });
      return;
    }

    setLoadingProvider(provider);

    try {
      // Option 1: Direct redirect (simpler)
      await StreamingProviderOAuthClient.connectProvider(
        provider,
        userId,
        window.location.pathname // Return to current page
      );

      // Note: User will be redirected, so code below won't execute
    } catch (error) {
      console.error("Connection error:", error);
      setNotification({
        type: "error",
        message: `Failed to connect to ${provider}. Please try again.`,
      });
      setLoadingProvider(null);
    }
  }

  async function disconnectStreamingProvider(provider: string) {
    if (!userId) return;

    setLoadingProvider(provider);

    try {
      await StreamingProviderOAuthClient.disconnectProvider(provider, userId);

      setNotification({
        type: "success",
        message: `Disconnected from ${provider}`,
      });

      // Update local state immediately for better UX
      setConnectedStreamingProviders((prev) =>
        prev ? prev.filter((p) => p !== provider) : null
      );

      // Optionally refresh streaming credentials
      // Your AuthProvider should handle this
    } catch (error) {
      console.error("Disconnect error:", error);
      setNotification({
        type: "error",
        message: `Failed to disconnect from ${provider}. Please try again.`,
      });
    } finally {
      setLoadingProvider(null);
    }
  }

  const isProviderConnected = (provider: string): boolean => {
    return connectedStreamingProviders?.includes(provider) || false;
  };

  const isProviderLoading = (provider: string): boolean => {
    return loadingProvider === provider;
  };

  if (isPending) {
    return (
      <main className="flex flex-col m-2">
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col m-2">
      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-3 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex flex-col justify-between gap-2 mb-4">
        <h1 className="text-xl font-semibold mb-4">Settings</h1>
        <p>Connect a streaming provider:</p>
      </div>

      <div className="flex flex-col justify-between gap-2">
        <ul className="space-y-2">
          {availableStreamingProviders.map((provider, index) => {
            const isConnected = isProviderConnected(provider);
            const isLoading = isProviderLoading(provider);

            return (
              <li key={index}>
                <Button
                  className={`w-1/2 py-2 px-4 rounded transition-colors ${
                    isConnected
                      ? "bg-red-500 hover:bg-red-400 text-white"
                      : "bg-green-500 hover:bg-green-400 text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    if (isLoading) return;

                    if (isConnected) {
                      disconnectStreamingProvider(provider);
                    } else {
                      connectStreamingProvider(provider);
                    }
                  }}
                  disabled={isLoading || !userId}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      {isConnected ? `Disconnecting...` : `Connecting...`}
                    </>
                  ) : (
                    `${isConnected ? "Disconnect" : "Connect"} ${provider}`
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-md text-sm">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>User ID: {userId || "Not logged in"}</p>
          <p>
            Connected Providers: {JSON.stringify(connectedStreamingProviders)}
          </p>
          <p>Loading: {loadingProvider || "None"}</p>
        </div>
      )}
    </main>
  );
}
