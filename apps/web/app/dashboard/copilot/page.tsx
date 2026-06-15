import { cookies } from "next/headers";
import { CopilotChat } from "@/components/features/dashboard/copilot-chat";

export default async function CopilotPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return (
    <div className="w-full h-[calc(100vh-8rem)] overflow-hidden animate-in fade-in duration-500">
      <CopilotChat token={token} />
    </div>
  );
}
