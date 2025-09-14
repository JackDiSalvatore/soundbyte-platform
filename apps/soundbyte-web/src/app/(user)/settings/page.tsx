"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { env } from "@/lib/environment";
import axios from "axios";
import { useEffect, useState } from "react";

/*************************************************************************************
 */

// Enhanced OAuth client for your streaming API
class StreamingProviderOAuthClient {
  private static baseUrl = env.NEXT_PUBLIC_STREAMING_API;

  /**
   * Initiate OAuth flow for a streaming provider
   */
  static async connectProvider(
    provider: string,
    userId: string,
    returnTo?: string
  ) {
    try {
      // Option 1: Direct redirect to your NestJS OAuth endpoint
      const params = new URLSearchParams();
      if (returnTo) params.set("returnTo", returnTo);

      window.location.href = `${this.baseUrl}/auth/${provider}?${params.toString()}`;
    } catch (error) {
      console.error(`Failed to connect to ${provider}:`, error);
      throw new Error(`Failed to initiate ${provider} connection`);
    }
  }

  /**
   * Alternative: Get OAuth URL from backend first (more control)
   */
  static async getOAuthUrl(
    provider: string,
    userId: string,
    returnTo?: string
  ): Promise<string> {
    try {
      const params = new URLSearchParams();
      if (returnTo) params.set("returnTo", returnTo);
      if (userId) params.set("userId", userId);

      const response = await axios.get(
        `${this.baseUrl}/api/oauth/${provider}/url?${params.toString()}`,
        { withCredentials: true }
      );

      return response.data.authUrl;
    } catch (error) {
      console.error(`Failed to get OAuth URL for ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Check connection status for a provider
   */
  static async checkProviderStatus(provider: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/${provider}/status`,
        { withCredentials: true }
      );
      return response.data.connected || false;
    } catch (error) {
      console.error(`Failed to check ${provider} status:`, error);
      return false;
    }
  }

  /**
   * Disconnect a streaming provider
   */
  static async disconnectProvider(
    provider: string,
    userId: string
  ): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/disconnect/userId/${userId}/provider/${provider}`,
        { provider, userId },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Handle OAuth return (call this on component mount)
   */
  static handleOAuthReturn(): {
    success: boolean;
    provider?: string;
    error?: string;
  } {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get("auth");
    const provider = urlParams.get("provider");
    const error = urlParams.get("error");

    if (authStatus === "success" && provider) {
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      return { success: true, provider };
    } else if (error) {
      window.history.replaceState({}, "", window.location.pathname);
      return { success: false, error };
    }

    return { success: false };
  }
}

const availableStreamingProviders = ["spotify", "soundcloud"];

/*************************************************************************************
 */

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
      window.location.reload(); // Or call your refresh method
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
