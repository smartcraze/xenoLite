import { cookies } from "next/headers";
import { CopilotChat } from "@/components/features/dashboard/copilot-chat";

export default async function CopilotPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Copilot</h1>
      </div>
      <CopilotChat token={token} />
    </div>
  );
}
