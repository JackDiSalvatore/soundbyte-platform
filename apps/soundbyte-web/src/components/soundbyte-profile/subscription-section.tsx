import type {
  SoundByteProfile,
  SoundByteSubscription,
} from "@/types/soundbyte.types";

type SubscriptionSectionProps = {
  profile: SoundByteProfile | null;
  subscription: SoundByteSubscription | null;
  selectedPlan: "free" | "pro";
  onPlanChange: (plan: "free" | "pro") => void;
};

export function SubscriptionSection({
  profile,
  subscription,
  selectedPlan,
  onPlanChange,
}: SubscriptionSectionProps) {
  if (profile && subscription) {
    // Existing user - show read-only subscription info
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Subscription
        </h2>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Plan:</span>{" "}
            <span className="capitalize">{subscription.plan}</span>
          </p>
          {subscription.started_at && (
            <p className="text-sm">
              <span className="font-medium">Started:</span>{" "}
              {new Date(subscription.started_at).toLocaleDateString()}
            </p>
          )}
          {subscription.expires_at && (
            <p className="text-sm">
              <span className="font-medium">Expires:</span>{" "}
              {new Date(subscription.expires_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // New user - show plan selector
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Choose Your Plan
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Select a subscription plan to get started
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Plan */}
        <label
          className={`relative flex flex-col p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedPlan === "free"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <input
            type="radio"
            name="subscription"
            value="free"
            checked={selectedPlan === "free"}
            onChange={(e) => onPlanChange(e.target.value as "free" | "pro")}
            className="sr-only"
          />
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Free</h3>
            {selectedPlan === "free" && (
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-4">$0</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Basic features
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Public profile
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Limited storage
            </li>
          </ul>
        </label>

        {/* Pro Plan */}
        <label
          className={`relative flex flex-col p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedPlan === "pro"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <input
            type="radio"
            name="subscription"
            value="pro"
            checked={selectedPlan === "pro"}
            onChange={(e) => onPlanChange(e.target.value as "free" | "pro")}
            className="sr-only"
          />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                Popular
              </span>
            </div>
            {selectedPlan === "pro" && (
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            $9.99
            <span className="text-sm font-normal text-gray-600">/month</span>
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              All free features
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Unlimited storage
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Priority support
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Advanced analytics
            </li>
          </ul>
        </label>
      </div>
    </div>
  );
}
