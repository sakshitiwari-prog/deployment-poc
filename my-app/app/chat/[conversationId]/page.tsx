import ChatSidebar from "@/app/components/ChatSidebar";
import ChatWindow from "@/app/components/ChatWindow";

export default async function Chat({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  console.log(conversationId, "conversationId");

  return (
    <div className="flex w-full h-screen">
      <ChatSidebar />

      <ChatWindow conversationId={conversationId} />
    </div>
  );
}
