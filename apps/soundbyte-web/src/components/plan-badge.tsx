import { Crown, Star, Zap } from "lucide-react";

// Plan badge component with different styles for different plans
export function PlanBadge({ plan }: { plan: string }) {
  const getPlanConfig = (planName: string) => {
    const normalizedPlan = planName.toLowerCase().replace(/\s+/g, "");

    switch (normalizedPlan) {
      case "proplus":
      case "pro+":
        return {
          label: "Pro+",
          icon: Crown,
          gradient:
            "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600",
          textColor: "text-white",
          glowColor: "shadow-yellow-500/30",
          ringColor: "ring-yellow-400/40",
        };
      case "pro":
        return {
          label: "Pro",
          icon: Star,
          gradient: "bg-gradient-to-r from-orange-500 to-red-500",
          textColor: "text-white",
          glowColor: "shadow-orange-500/25",
          ringColor: "ring-orange-400/30",
        };
      case "go":
      case "go+":
        return {
          label: plan.includes("+") ? "Go+" : "Go",
          icon: Zap,
          gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
          textColor: "text-white",
          glowColor: "shadow-blue-500/25",
          ringColor: "ring-blue-400/30",
        };
      case "free":
      default:
        return {
          label: "Free",
          icon: null,
          gradient: "bg-gradient-to-r from-gray-400 to-gray-500",
          textColor: "text-white",
          glowColor: "shadow-gray-500/20",
          ringColor: "ring-gray-400/30",
        };
    }
  };

  const config = getPlanConfig(plan);
  const IconComponent = config.icon;

  return (
    <div
      className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
      ${config.gradient} ${config.textColor}
      shadow-lg ${config.glowColor}
      ring-1 ${config.ringColor}
      transform transition-all duration-200 hover:scale-105 hover:shadow-xl
    `}
    >
      {IconComponent && <IconComponent size={12} className="flex-shrink-0" />}
      <span>{config.label}</span>
    </div>
  );
}
