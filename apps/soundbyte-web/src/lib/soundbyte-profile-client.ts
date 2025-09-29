import { env } from "@/lib/environment";
import { SoundByteGenre } from "@/types/soundbyte-genre";
import { SoundByteProfile } from "@/types/soundbyte-profile";
import { SoundByteSocialLink } from "@/types/soundbyte-social-link";
import { SoundByteSubscription } from "@/types/soundbyte-subscription";
import axios from "axios";

export class SoundByteProfileClient {
  private static baseUrl = env.NEXT_PUBLIC_STREAMING_API;

  /**
   * Get all genres
   */
  static async getGenres(): Promise<
    {
      id: number;
      name: string;
    }[]
  > {
    try {
      const res = await axios.get(`${this.baseUrl}/api/genres`);

      return res.data;
    } catch (error) {
      console.error(`Failed to get genres:`, error);
      throw error;
    }
  }

  /**
   * Get users genres
   */
  static async getSoundByteUsersGenres({
    userId,
  }: {
    userId: string;
  }): Promise<SoundByteGenre[]> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/profiles/userId/${userId}/genres`
      );

      return res.data;
    } catch (error) {
      console.error(`Failed to get users genres:`, error);
      throw error;
    }
  }

  /**
   * Get users social links
   */
  static async getSoundByteUsersSocialLinks({
    userId,
  }: {
    userId: string;
  }): Promise<SoundByteSocialLink[]> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/profiles/userId/${userId}/social-links`
      );

      return res.data;
    } catch (error) {
      console.error(`Failed to get users social links:`, error);
      throw error;
    }
  }

  /**
   * Get users subscription info
   */
  static async getSoundByteUsersSubscription({
    userId,
  }: {
    userId: string;
  }): Promise<SoundByteSubscription> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/profiles/userId/${userId}/subscriptions`
      );

      return res.data;
    } catch (error) {
      console.error(`Failed to get users subscription:`, error);
      throw error;
    }
  }

  /**
   * Get users SoundByte profile by user id
   */
  static async getSoundByteProfileByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<any> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/profiles/userId/${userId}/profile`
      );

      return res.data;
    } catch (error) {
      console.error(`Failed to get ${userId}'s profile:`, error);
      throw error;
    }
  }

  /**
   * Get users SoundByte profile by provider id
   */
  static async getSoundByteProfileByProviderId({
    providerId,
  }: {
    providerId: string;
  }): Promise<any> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/profiles/providerId/${providerId}/profile`
      );

      return res.data;
    } catch (error) {
      console.error(`Failed to get ${providerId}'s profile:`, error);
      throw error;
    }
  }

  /**
   * Create users SoundByte profile
   */
  static async createSoundByteProfile(props: {
    profile: SoundByteProfile;
    subscription?: SoundByteSubscription;
    genres?: SoundByteGenre[];
    socials?: SoundByteSocialLink[];
  }): Promise<any> {
    const { profile, subscription, genres, socials } = props;
    try {
      console.log("props:", props);

      const res = await axios.request({
        method: "post",
        url: `${this.baseUrl}/api/profiles`,
        data: {
          profile,
          subscription,
          socials,
          genres:
            genres?.map((id, name) => {
              return name;
            }) ?? [],
        },
      });

      return res.data;
    } catch (error) {
      console.error(`Failed to create users profile:`, error);
      throw error;
    }
  }

  /**
   * Update users SoundByte profile
   */
  static async updateSoundByteProfile(props: {
    profile: {
      userId: string;
      providerId: string;
      email: string;
      verified?: boolean;
      public?: boolean;
    };
    subscription?: {
      plan: string;
      expiresAt?: Date;
    };
    genres?: { id: number; name: string }[];
    socials?: {
      platform: string; // "instagram" | "twitter" | "facebook" | "tiktok" | "spotify" | "bandcamp" | "youtube"
      url: string;
    }[];
  }): Promise<any> {
    const { profile, subscription, genres, socials } = props;
    try {
      console.log("props:", props);

      const res = await axios.request({
        method: "patch",
        url: `${this.baseUrl}/api/profiles/${props.profile.userId}`,
        data: {
          profile,
          subscription,
          socials,
          genres:
            genres?.map((id, name) => {
              return name;
            }) ?? [],
        },
      });

      return res.data;
    } catch (error) {
      console.error(`Failed to create users profile:`, error);
      throw error;
    }
  }
}
