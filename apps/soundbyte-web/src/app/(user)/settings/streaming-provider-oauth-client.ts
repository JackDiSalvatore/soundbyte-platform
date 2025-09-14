// Enhanced OAuth client for your streaming API
import { env } from "@/lib/environment";
import axios from "axios";

export class StreamingProviderOAuthClient {
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
