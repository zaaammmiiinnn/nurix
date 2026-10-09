import React from "react";
import { notFound } from "next/navigation";
import { getAdminChatSessionWithMessages } from "@/app/admin/chats/actions";
import { ChatThread } from "@/components/admin/chat-thread";

export const metadata = {
  title: "Live Chat Thread | NeuralWaves Admin",
  description: "View visitor conversation thread and intervene as an engineer.",
};

export const dynamic = "force-dynamic";

interface ChatDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminChatDetailPage({ params }: ChatDetailPageProps) {
  const { id } = await params;
  const { session, messages } = await getAdminChatSessionWithMessages(id);

  if (!session) {
    notFound();
  }

  return <ChatThread initialSession={session} initialMessages={messages} />;
}
