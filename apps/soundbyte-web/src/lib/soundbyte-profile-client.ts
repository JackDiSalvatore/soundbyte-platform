import { env } from "@/lib/environment";
import type {
  SoundByteGenre,
  SoundByteProfile,
  SoundByteSocialLink,
  SoundByteSubscription,
} from "@/types/soundbyte.types";

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
   * Create / Update users genres
   */
  static async updateSoundByteUsersGenres({
    userId,
    genreIds,
  }: {
    userId: string;
    genreIds: number[];
  }): Promise<
    { id: string; profileId: string; platform: string; url: string }[]
  > {
    try {
      const res = await axios.post(
        `${this.baseUrl}/api/profiles/userId/${userId}/genres`,
        {
          genreIds,
        }
      );

      console.log("res: ", res);

      return res.data;
    } catch (error) {
      console.error(`Failed to update users genres:`, error);
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
   * Create / Update users social links
   */
  static async updateSoundByteUsersSocialLinks({
    userId,
    links,
  }: {
    userId: string;
    links: Record<string, string | null>[];
  }): Promise<
    { id: string; profileId: string; platform: string; url: string }[]
  > {
    try {
      const res = await axios.post(
        `${this.baseUrl}/api/profiles/userId/${userId}/social-links`,
        {
          data: {
            links,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(`Failed to update users social links:`, error);
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
   * Create / Update users subscription
   */
  static async updateSoundByteUsersSubscription({
    userId,
    plan,
  }: {
    userId: string;
    plan: string;
  }): Promise<SoundByteSubscription[]> {
    try {
      const res = await axios.post(
        `${this.baseUrl}/api/profiles/userId/${userId}/subscription`,
        {
          data: {
            plan: plan,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(`Failed to update users subscription:`, error);
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
  static async createSoundByteUsersProfile(
    profile: SoundByteProfile
  ): Promise<any> {
    try {
      console.log("Creating profile: ", profile);

      const res = await axios.request({
        method: "post",
        url: `${this.baseUrl}/api/profiles`,
        data: profile,
      });

      console.log("res: ", res);

      return res.data;
    } catch (error) {
      console.error(`Failed to create users profile:`, error);
      throw error;
    }
  }

  /**
   * Create users SoundByte profile with relations
   */
  // static async createSoundByteUsersProfileWithRelations(props: {
  //   profile: SoundByteProfile;
  //   subscription?: SoundByteSubscription;
  //   genres?: SoundByteGenre[];
  //   socials?: SoundByteSocialLink[];
  // }): Promise<any> {
  //   const { profile, subscription, genres, socials } = props;
  //   try {
  //     console.log("props:", props);

  //     const res = await axios.request({
  //       method: "post",
  //       url: `${this.baseUrl}/api/profiles`,
  //       data: {
  //         profile,
  //         subscription,
  //         socials,
  //         genres:
  //           genres?.map((id, name) => {
  //             return name;
  //           }) ?? [],
  //       },
  //     });

  //     return res.data;
  //   } catch (error) {
  //     console.error(`Failed to create users profile:`, error);
  //     throw error;
  //   }
  // }

  /**
   * Update users SoundByte profile
   */
  static async updateSoundByteUsersProfile({
    userId,
    profile,
  }: {
    userId: string;
    profile: SoundByteProfile;
  }): Promise<any> {
    try {
      const res = await axios.request({
        method: "patch",
        url: `${this.baseUrl}/api/profiles/${userId}`,
        data: profile,
      });

      return res.data;
    } catch (error) {
      console.error(`Failed to create users profile:`, error);
      throw error;
    }
  }

  /**
   * Delete users SoundByte profile
   */
  static async deleteSoundByteUsersProfile({
    userId,
  }: {
    userId: string;
  }): Promise<any> {
    try {
      const res = await axios.request({
        method: "delete",
        url: `${this.baseUrl}/api/profiles/${userId}`,
      });

      return res.data;
    } catch (error) {
      console.error(`Failed to delete users profile:`, error);
      throw error;
    }
  }
}
