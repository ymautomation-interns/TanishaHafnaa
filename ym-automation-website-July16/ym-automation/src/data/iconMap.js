import {
  Cloud,
  Bot,
  Settings,
  Wrench,
  Code,
  Zap,
  Cpu,
  Eye,
  Ruler,
  PenTool,
  Monitor,
  Rocket,
  Headphones,
  Cog,
  Radio,
  Database,
  Shield,
  Globe,
} from "lucide-react";

// Icon choices offered in the admin panel for "Our Services" items.
// Keep the keys stable — they're what's stored in the database.
export const ICON_MAP = {
  Cloud,
  Bot,
  Settings,
  Wrench,
  Code,
  Zap,
  Cpu,
  Eye,
  Ruler,
  PenTool,
  Monitor,
  Rocket,
  Headphones,
  Cog,
  Radio,
  Database,
  Shield,
  Globe,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name) {
  return ICON_MAP[name] || Settings;
}
