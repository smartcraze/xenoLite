"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";

export function AiCopilot() {
  return (
    <Card className="flex flex-col h-full border-border/50 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-md">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Copilot</CardTitle>
            <CardDescription>Tell me what you want to do</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="relative mt-auto">
          <Textarea 
            placeholder="e.g., 'Draft a campaign for users who haven't purchased in 30 days...'" 
            className="min-h-[120px] resize-none pr-12 pb-12 bg-muted/50 border-border/50 focus-visible:ring-primary/50"
          />
          <div className="absolute bottom-3 left-3 flex gap-2">
            <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full">
              Segments
            </Button>
            <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full">
              Draft SMS
            </Button>
          </div>
          <Button size="icon" className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
