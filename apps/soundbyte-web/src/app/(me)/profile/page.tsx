"use client";

import { useAuth } from "@/context/AuthProvider";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { useState, useEffect } from "react";

type SoundByteProfile = {
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
};

const SOCIAL_PLATFORMS = [
  "instagram",
  "twitter",
  "facebook",
  "tiktok",
  "spotify",
  "bandcamp",
  "youtube",
] as const;

export default function ProfilePage() {
  const { session } = useAuth();
  const [genres, setGenres] = useState<
    | {
        id: number;
        name: string;
      }[]
    | null
  >(null);
  const [providerId, setProviderId] = useState();
  const [profile, setProfile] = useState<SoundByteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    public: false,
    genres: [] as { id: number; name: string }[],
    socials: [] as { platform: string; url: string }[],
  });

  // Load providerId on mount
  useEffect(() => {
    if (!session) return;
    StreamingProviderClient.profile({
      provider: "soundcloud",
      userId: session?.user.id,
    }).then((res) => {
      console.log("Provider User Id: ", res.id);
      setProviderId(res.id);
    });
  }, [session]);

  // Load genres on mount
  useEffect(() => {
    if (!session) return;

    StreamingProviderClient.getGenres()
      .then((res) => {
        console.log("Available genres:");
        console.log(res);
        setGenres(res);
      })
      .catch((error) => {
        console.error("Failed to load genres:", error);
        setMessage({ type: "error", text: "Failed get genres" });
      })
      .finally(() => {});
  }, [session]);

  // Load profile on mount
  useEffect(() => {
    if (!session) return;

    StreamingProviderClient.getSoundByteProfileByUserId({
      userId: session.user.id,
    })
      .then((res) => {
        setProfile(res);
        // Initialize form data
        setFormData({
          email: res.profile.email || "",
          public: res.profile.public || false,
          genres: res.genres || [],
          socials: res.socials || [],
        });
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
        setMessage({ type: "error", text: "Failed to load profile" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenreToggle = (genre: { id: number; name: string }) => {
    setFormData((prev) => {
      const isSelected = prev.genres.some((g) => g.id === genre.id);
      return {
        ...prev,
        genres: isSelected
          ? prev.genres.filter((g) => g.id !== genre.id)
          : [...prev.genres, genre],
      };
    });
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socials: [...prev.socials, { platform: "instagram", url: "" }],
    }));
  };

  const updateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      ),
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!providerId) return;

    setSaving(true);
    setMessage(null);

    try {
      // Build the profile object from form data
      const profileData: SoundByteProfile = {
        profile: {
          userId: session.user.id,
          providerId: providerId,
          email: formData.email,
          verified: profile?.profile.verified,
          public: formData.public,
        },
        subscription: profile?.subscription,
        genres: formData.genres,
        socials: formData.socials.filter((social) => social.url.trim() !== ""),
      };

      await StreamingProviderClient.createSoundByteProfile(profileData);
      setProfile(profileData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
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
          Manage your SoundByte profile information
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
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="public"
                checked={formData.public}
                onChange={(e) => handleInputChange("public", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="public"
                className="ml-2 block text-sm text-gray-700"
              >
                Make my profile public
              </label>
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Favorite Genres
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Select the genres you're most interested in
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genres &&
              genres.map((genre) => (
                <label
                  key={genre.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.genres.some((g) => g.id === genre.id)}
                    onChange={() => handleGenreToggle(genre)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{genre.name}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Social Links
            </h2>
            <button
              type="button"
              onClick={addSocialLink}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {formData.socials.map((social, index) => (
              <div key={index} className="flex gap-3 items-center">
                <select
                  value={social.platform}
                  onChange={(e) =>
                    updateSocialLink(index, "platform", e.target.value)
                  }
                  className="block w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>

                <input
                  type="url"
                  placeholder="Enter URL..."
                  value={social.url}
                  onChange={(e) =>
                    updateSocialLink(index, "url", e.target.value)
                  }
                  className="flex-1 block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  Remove
                </button>
              </div>
            ))}

            {formData.socials.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No social links added yet. Click "Add Link" to get started.
              </p>
            )}
          </div>
        </div>

        {/* Subscription Info (Read-only) */}
        {profile?.subscription && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Subscription
            </h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Plan:</span>{" "}
                {profile.subscription.plan}
              </p>
              {profile.subscription.expiresAt && (
                <p className="text-sm">
                  <span className="font-medium">Expires:</span>{" "}
                  {new Date(
                    profile.subscription.expiresAt
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
