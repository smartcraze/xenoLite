import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CopilotPage() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Copilot</h1>
      </div>
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>
            Generate campaigns and segment audiences using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm">
          AI Copilot workspace coming soon.
        </CardContent>
      </Card>
    </div>
  );
}
