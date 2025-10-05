const SOCIAL_PLATFORMS = [
  "instagram",
  "twitter",
  "facebook",
  "tiktok",
  "spotify",
  "bandcamp",
  "youtube",
] as const;

type SocialLinksSectionProps = {
  socials: { platform: string; url: string }[];
  onAddSocial: () => void;
  onUpdateSocial: (
    index: number,
    field: "platform" | "url",
    value: string
  ) => void;
  onRemoveSocial: (index: number) => void;
};

export function SocialLinksSection({
  socials,
  onAddSocial,
  onUpdateSocial,
  onRemoveSocial,
}: SocialLinksSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
        <button
          type="button"
          onClick={onAddSocial}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Add Link
        </button>
      </div>

      <div className="space-y-3">
        {socials.map((social, index) => (
          <div key={index} className="flex gap-3 items-center">
            <select
              value={social.platform}
              onChange={(e) =>
                onUpdateSocial(index, "platform", e.target.value)
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
              onChange={(e) => onUpdateSocial(index, "url", e.target.value)}
              className="flex-1 block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => onRemoveSocial(index)}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Remove
            </button>
          </div>
        ))}

        {socials.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No social links added yet. Click "Add Link" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
