import { permanentRedirect } from "next/navigation";

export default function LegacyAgentsRedirect() {
  permanentRedirect("/services/ai-agents");
}
