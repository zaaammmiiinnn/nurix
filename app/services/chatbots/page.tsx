import { permanentRedirect } from "next/navigation";

export default function LegacyChatbotsRedirect() {
  permanentRedirect("/services/ai-chatbots");
}
