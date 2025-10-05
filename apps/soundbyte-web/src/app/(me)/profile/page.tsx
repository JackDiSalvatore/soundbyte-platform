"use client";

import { useAuth } from "@/context/AuthProvider";
import { SoundByteProfileClient } from "@/lib/soundbyte-profile-client";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import type {
  SoundByteProfile,
  SoundByteGenre,
  SoundByteSocialLink,
  SoundByteSubscription,
} from "@/types/soundbyte.types";
import { useState, useEffect } from "react";
import { BasicInfoSection } from "@/components/soundbyte-profile/basic-info-section";
import { GenresSection } from "@/components/soundbyte-profile/genres-section";
import { SocialLinksSection } from "@/components/soundbyte-profile/social-links-section";
import { SubscriptionSection } from "@/components/soundbyte-profile/subscription-section";
import { DeleteConfirmModal } from "@/components/soundbyte-profile/delete-confirm-modal";
import { ProfileFormData } from "@/types/soundbyte-profile-form-data.type";

export default function ProfilePage() {
  const { session } = useAuth();

  // Platform data (loaded first)
  const [providerId, setProviderId] = useState<string | null>(null);
  const [availableGenres, setAvailableGenres] = useState<
    SoundByteGenre[] | null
  >(null);
  const [platformDataLoaded, setPlatformDataLoaded] = useState(false);

  // User data
  const [profile, setProfile] = useState<SoundByteProfile | null>(null);
  const [usersGenres, setUsersGenres] = useState<SoundByteGenre[]>([]);
  const [usersSocialLinks, setUsersSocialLinks] = useState<
    SoundByteSocialLink[]
  >([]);
  const [usersSubscription, setUsersSubscription] =
    useState<SoundByteSubscription | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    email: "",
    public: false,
    verified: false,
    selectedGenres: [],
    socials: [],
    subscriptionPlan: "free",
  });

  // Step 1: Load platform data (providerId and available genres)
  useEffect(() => {
    if (!session) return;

    const loadPlatformData = async () => {
      try {
        const providerRes = await StreamingProviderClient.profile({
          provider: "soundcloud",
          userId: session.user.id,
        });
        setProviderId(providerRes.id);

        const genresRes = await SoundByteProfileClient.getGenres();
        setAvailableGenres(genresRes);

        setPlatformDataLoaded(true);
      } catch (error) {
        console.error("Failed to load platform data:", error);
        setMessage({ type: "error", text: "Failed to load platform data" });
        setLoading(false);
      }
    };

    loadPlatformData();
  }, [session]);

  // Step 2: Load user data once platform data is ready
  useEffect(() => {
    if (!session || !platformDataLoaded) return;

    const loadUserData = async () => {
      try {
        const profileRes =
          await SoundByteProfileClient.getSoundByteProfileByUserId({
            userId: session.user.id,
          });
        setProfile(profileRes);

        const genresRes = await SoundByteProfileClient.getSoundByteUsersGenres({
          userId: session.user.id,
        });
        setUsersGenres(genresRes);

        const socialLinksRes =
          await SoundByteProfileClient.getSoundByteUsersSocialLinks({
            userId: session.user.id,
          });
        setUsersSocialLinks(socialLinksRes);

        const subscriptionRes =
          await SoundByteProfileClient.getSoundByteUsersSubscription({
            userId: session.user.id,
          });
        setUsersSubscription(subscriptionRes);

        setFormData({
          email: profileRes.email || "",
          public: profileRes.public || false,
          verified: profileRes.verified || false,
          selectedGenres: genresRes || [],
          socials:
            socialLinksRes.map((link) => ({
              platform: link.platform,
              url: link.url,
            })) || [],
          subscriptionPlan: subscriptionRes?.plan || "free",
        });
      } catch (error) {
        console.error("Failed to load user data:", error);
        setFormData({
          email: session.user.email || "",
          public: false,
          verified: false,
          selectedGenres: [],
          socials: [],
          subscriptionPlan: "free",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session, platformDataLoaded]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !providerId) return;

    setSaving(true);
    setMessage(null);

    try {
      if (!profile) {
        const newProfile: SoundByteProfile = {
          id: 0,
          user_id: session.user.id,
          provider_id: providerId,
          email: formData.email,
          verified: formData.verified,
          public: formData.public,
        };

        const newSocials: SoundByteSocialLink[] = formData.socials
          .filter((social) => social.url.trim() !== "")
          .map((social) => ({
            id: 0,
            profile_id: 0,
            platform: social.platform as any,
            url: social.url,
          }));

        const newSubscription: SoundByteSubscription = {
          id: 0,
          profile_id: 0,
          plan: formData.subscriptionPlan,
          started_at: new Date(),
        };

        // await SoundByteProfileClient.createSoundByteUsersProfileWithRelations({
        //   profile: newProfile,
        //   genres: formData.selectedGenres,
        //   socials: newSocials,
        //   subscription: newSubscription,
        // });

        console.log("You are submitting profile: ", newProfile);
        console.log("You are submitting genres: ", formData.selectedGenres);
        console.log("You are submitting socials: ", newSocials);
        console.log("You are submitting subscription: ", newSubscription);

        setMessage({ type: "success", text: "Profile created successfully!" });
      } else {
        const updatedProfile: SoundByteProfile = {
          ...profile,
          email: formData.email,
          verified: formData.verified,
          public: formData.public,
        };

        await SoundByteProfileClient.updateSoundByteUsersProfile({
          userId: session.user.id,
          profile: updatedProfile,
        });

        const genreIds = formData.selectedGenres.map((g) => g.id);
        await SoundByteProfileClient.updateSoundByteUsersGenres({
          userId: session.user.id,
          genreIds,
        });

        const socialLinks = formData.socials
          .filter((social) => social.url.trim() !== "")
          .map((social) => ({
            platform: social.platform,
            url: social.url,
          }));

        await SoundByteProfileClient.updateSoundByteUsersSocialLinks({
          userId: session.user.id,
          links: socialLinks,
        });

        setProfile(updatedProfile);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage({
        type: "error",
        text: "Failed to save profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!session) return;

    try {
      await SoundByteProfileClient.deleteSoundByteUsersProfile({
        userId: session.user.id,
      });

      setProfile(null);
      setUsersGenres([]);
      setUsersSocialLinks([]);
      setUsersSubscription(null);
      setFormData({
        email: session.user.email || "",
        public: false,
        verified: false,
        selectedGenres: [],
        socials: [],
        subscriptionPlan: "free",
      });
      setShowDeleteConfirm(false);
      setMessage({ type: "success", text: "Profile deleted successfully." });
    } catch (error) {
      console.error("Failed to delete profile:", error);
      setMessage({
        type: "error",
        text: "Failed to delete profile. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          {profile
            ? "Manage your SoundByte profile information"
            : "Create your SoundByte profile"}
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        <BasicInfoSection
          formData={formData}
          onInputChange={handleInputChange}
        />

        <GenresSection
          availableGenres={availableGenres}
          selectedGenres={formData.selectedGenres}
          onGenreToggle={(genre) => {
            const isSelected = formData.selectedGenres.some(
              (g) => g.id === genre.id
            );
            handleInputChange(
              "selectedGenres",
              isSelected
                ? formData.selectedGenres.filter((g) => g.id !== genre.id)
                : [...formData.selectedGenres, genre]
            );
          }}
        />

        <SocialLinksSection
          socials={formData.socials}
          onAddSocial={() => {
            handleInputChange("socials", [
              ...formData.socials,
              { platform: "instagram", url: "" },
            ]);
          }}
          onUpdateSocial={(index, field, value) => {
            handleInputChange(
              "socials",
              formData.socials.map((social, i) =>
                i === index ? { ...social, [field]: value } : social
              )
            );
          }}
          onRemoveSocial={(index) => {
            handleInputChange(
              "socials",
              formData.socials.filter((_, i) => i !== index)
            );
          }}
        />

        <SubscriptionSection
          profile={profile}
          subscription={usersSubscription}
          selectedPlan={formData.subscriptionPlan}
          onPlanChange={(plan) => handleInputChange("subscriptionPlan", plan)}
        />

        <div className="flex justify-between items-center">
          {profile && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Profile
            </button>
          )}
          <button
            type="submit"
            disabled={saving || !providerId}
            className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${!profile ? "ml-auto" : ""}`}
          >
            {saving
              ? "Saving..."
              : profile
                ? "Update Profile"
                : "Create Profile"}
          </button>
        </div>
      </form>

      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProfile}
      />
    </div>
  );
}
