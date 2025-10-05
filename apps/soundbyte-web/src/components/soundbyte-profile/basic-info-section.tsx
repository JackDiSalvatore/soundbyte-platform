import { ProfileFormData } from "@/types/soundbyte-profile-form-data.type";

type BasicInfoSectionProps = {
  formData: ProfileFormData;
  onInputChange: (field: keyof ProfileFormData, value: any) => void;
};

export function BasicInfoSection({
  formData,
  onInputChange,
}: BasicInfoSectionProps) {
  return (
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
            onChange={(e) => onInputChange("email", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="public"
            checked={formData.public}
            onChange={(e) => onInputChange("public", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="public" className="ml-2 block text-sm text-gray-700">
            Make my profile public
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified"
            checked={formData.verified}
            onChange={(e) => onInputChange("verified", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="verified"
            className="ml-2 block text-sm text-gray-700"
          >
            Verified account
          </label>
        </div>
      </div>
    </div>
  );
}
