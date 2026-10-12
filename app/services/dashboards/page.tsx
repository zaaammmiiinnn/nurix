import { permanentRedirect } from "next/navigation";

export default function LegacyDashboardsRedirect() {
  permanentRedirect("/services/web-apps");
}
