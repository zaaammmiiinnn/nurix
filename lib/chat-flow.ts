/**
 * NeuralWaves Automated Website Chat Flow & Menu Bot
 * Handles interactive menu navigation, natural language intent routing,
 * and automated lead capture for inbound web visitors.
 */

export interface ChatFlowState {
  currentMenu?: "main" | "services" | "pricing" | "projects" | "human_lead";
  leadStep?: "ask_email" | "ask_name" | "completed";
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  visitorCompany?: string;
}

export interface ChatFlowResult {
  reply: string;
  newState: ChatFlowState;
  quickReplies?: string[];
  isLeadCaptured?: boolean;
  wantsHuman?: boolean;
  leadData?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    service?: string;
    message?: string;
  };
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?[0-9]{1,4}?[-.\s]?\(?[0-9]{1,3}?\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4})/;

export const MAIN_MENU_TEXT = `👋 **Welcome to NeuralWaves AI Studio (Dubai)**
We build fixed-price AI chatbots, custom dashboards, and business automation agents delivered in days.

How can we help you today?
1️⃣ **Our Services** (Chatbots, Dashboards, Agents)
2️⃣ **Transparent Pricing** (Fixed AED packages)
3️⃣ **Recent Projects** (Case studies & live demos)
4️⃣ **Talk to a Human / Get a Quote**

*Reply with a number (1-4) or type your question directly.*`;

export const MAIN_QUICK_REPLIES = [
  "1. Services",
  "2. Pricing",
  "3. Recent Projects",
  "4. Talk to Human",
];

/**
 * Pricing shown in chat.
 *
 * SECURITY/CORRECTNESS: this used to be hardcoded here (AED 2,000 / 4,500 /
 * 9,500) while the pricing page rendered different figures from the database
 * (AED 1,500 / 3,500 / 7,500). A visitor could be quoted one price in chat and see
 * another on /pricing seconds later. The bot now formats whatever the database
 * says, so there is exactly one source of truth.
 */
export interface ChatPricingTier {
  name: string;
  price: string;
  description?: string;
  deliveryTimeframe?: string;
  features?: string[];
  isFeatured?: boolean;
}

export function buildPricingReply(tiers: ChatPricingTier[]): string {
  if (!tiers || tiers.length === 0) {
    return `🏷️ **Transparent Fixed Pricing**
No hourly billing, no scope creep: one number agreed upfront, 50% to start and 50% on verified launch.

I don't have the current package list loaded — **reply 4** and an engineer will send the exact figures for your scope.`;
  }

  const lines = tiers.map((tier) => {
    const delivery = tier.deliveryTimeframe ? ` · ${tier.deliveryTimeframe}` : "";
    const popular = tier.isFeatured ? " *(Most popular)*" : "";
    const summary = tier.description ? `\n  ${tier.description}` : "";
    return `• **${tier.name} — ${tier.price}**${popular}${delivery}${summary}`;
  });

  return `🏷️ **Transparent Fixed Pricing (AED)**
No hourly billing. No scope creep. 50% upfront, 50% on verified launch.

${lines.join("\n\n")}

*Reply **4** to discuss your project or share your email to get a custom scope.*`;
}

export function processChatFlow(
  userMessage: string,
  state: ChatFlowState = { currentMenu: "main" },
  tiers?: ChatPricingTier[]
): ChatFlowResult {
  const text = userMessage.trim();
  const lower = text.toLowerCase();

  // 1. Check if an email was typed anywhere in the message
  const emailMatch = text.match(EMAIL_REGEX);
  if (emailMatch) {
    const extractedEmail = emailMatch[0].toLowerCase();
    const phoneMatch = text.match(PHONE_REGEX);
    const extractedPhone = phoneMatch ? phoneMatch[0] : state.visitorPhone;

    const updatedState: ChatFlowState = {
      ...state,
      visitorEmail: extractedEmail,
      visitorPhone: extractedPhone,
      leadStep: "completed",
    };

    return {
      reply: `✅ **Thank you!** We have registered your contact details (${extractedEmail}).\n\nAn engineer from our Dubai team has been notified and will reach out shortly. You can also book a direct 15-min call at [cal.com/neuralwaves/15min](https://cal.com/neuralwaves/15min).\n\nFeel free to leave any details about your project here!`,
      newState: updatedState,
      quickReplies: ["0. Back to Menu", "2. View Pricing", "3. View Projects"],
      isLeadCaptured: true,
      wantsHuman: true,
      leadData: {
        name: state.visitorName || "Chat Visitor",
        email: extractedEmail,
        phone: extractedPhone || "+971-Chat",
        service: "chatbots",
        message: text,
      },
    };
  }

  // 2. Navigation to Main Menu
  if (
    lower === "0" ||
    lower === "menu" ||
    lower === "main menu" ||
    lower === "back" ||
    lower === "restart" ||
    lower === "home" ||
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey"
  ) {
    return {
      reply: MAIN_MENU_TEXT,
      newState: { currentMenu: "main" },
      quickReplies: MAIN_QUICK_REPLIES,
    };
  }

  // 3. Current Menu: Services (1)
  if (
    lower === "1" ||
    lower === "1. services" ||
    lower === "services" ||
    lower.includes("service") ||
    lower.includes("what do you do") ||
    lower.includes("offerings")
  ) {
    const reply = `⚡ **NeuralWaves Core Services**
All delivered in days with 100% code ownership and 30-day post-launch warranty:

1. **AI Chatbots & WhatsApp Assistants**
   • 24/7 Meta Cloud API WhatsApp bots in English & Arabic.
   • Automated appointment booking & CRM lead capture.

2. **Custom Web & Admin Dashboards**
   • Replace spreadsheets with secure Next.js portals.
   • Real-time Postgres/Supabase, role-based access, and analytics.

3. **Autonomous AI Workflow Agents**
   • Agents that scrape leads, parse PDFs, and trigger webhooks.
   • Replaces repetitive human admin tasks.

*Reply **2** for current pricing, **3** for Projects, or **4** to speak with an engineer.*`;

    return {
      reply,
      newState: { currentMenu: "services" },
      quickReplies: ["2. Pricing", "3. Recent Projects", "4. Talk to Human", "0. Main Menu"],
    };
  }

  // 4. Current Menu: Pricing (2)
  if (
    lower === "2" ||
    lower === "2. pricing" ||
    lower === "pricing" ||
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("how much") ||
    lower.includes("quote")
  ) {
    const reply = buildPricingReply(tiers ?? []);

    return {
      reply,
      newState: { currentMenu: "pricing" },
      quickReplies: ["4. Talk to Human", "1. Services", "3. Recent Projects", "0. Main Menu"],
    };
  }

  // 5. Current Menu: Projects (3)
  if (
    lower === "3" ||
    lower === "3. recent projects" ||
    lower === "projects" ||
    lower === "work" ||
    lower.includes("portfolio") ||
    lower.includes("case studies") ||
    lower.includes("demo")
  ) {
    const reply = `🚀 **Recent Client Deployments in Dubai & UAE**

1. **Dubai Real Estate WhatsApp Bot**
   • 30-second lead qualification on high-value listings.
   • 4.2x faster response time, 40+ qualified leads weekly.

2. **F&B Kitchen Dispatch & Order Dashboard**
   • Replaced 3 manual spreadsheets with a unified dispatch board.
   • Saved kitchen staff 3 hours every single shift.

3. **Abu Dhabi Logistics Lead Agent**
   • Automated customs compliance inquiries and booking dispatch.
   • 99.4% resolution rate with zero manual data entry.

*Explore full case studies at [neuralwaves.in/work](https://neuralwaves.in/work) or reply **4** to talk to a human.*`;

    return {
      reply,
      newState: { currentMenu: "projects" },
      quickReplies: ["4. Talk to Human", "2. Pricing", "1. Services", "0. Main Menu"],
    };
  }

  // 6. Current Menu: Talk to Human / Contact (4)
  if (
    lower === "4" ||
    lower === "4. talk to human" ||
    lower === "human" ||
    lower.includes("talk to a human") ||
    lower.includes("contact") ||
    lower.includes("call") ||
    lower.includes("support") ||
    lower.includes("speak with") ||
    lower.includes("consultant")
  ) {
    const reply = `👨‍💻 **Connect with a Dubai Engineer**
We are ready to assist you. 

Please reply with your **email address** (or phone number) and a brief note about what you are looking to build. An engineer will respond here live or follow up via email within minutes.

*(You can also call or WhatsApp us directly at **+91 88409 36715**)*`;

    return {
      reply,
      newState: { currentMenu: "human_lead", leadStep: "ask_email" },
      quickReplies: ["0. Back to Menu"],
      wantsHuman: true,
    };
  }

  // 7. If in human_lead state and user provides their info
  if (state.currentMenu === "human_lead") {
    // If text contains a potential name or note
    return {
      reply: `Got it! Please make sure to include your **email address** so our team can send over the technical scoping brief and reach you.`,
      newState: state,
      quickReplies: ["0. Back to Menu"],
      wantsHuman: true,
    };
  }

  // 8. General fallback
  const fallback = `I didn't quite catch that. Here is our quick directory:

1️⃣ Reply **1** for **Services**
2️⃣ Reply **2** for **Pricing**
3️⃣ Reply **3** for **Recent Projects**
4️⃣ Reply **4** to **Talk to an Engineer**

Or simply type your email to get in touch!`;

  return {
    reply: fallback,
    newState: state,
    quickReplies: MAIN_QUICK_REPLIES,
  };
}
