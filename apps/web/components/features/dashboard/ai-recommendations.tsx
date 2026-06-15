import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AiRecommendations() {
  const recommendations = [
    {
      id: 1,
      title: "Win-back Campaign",
      description:
        "1,240 customers haven't purchased in 60 days. Offer a 15% discount.",
      impact: "High Impact",
      icon: TrendingUp,
    },
    {
      id: 2,
      title: "Abandoned Cart Reminder",
      description:
        "342 users left items in their cart in the last 24h. Send SMS reminder.",
      impact: "Quick Win",
      icon: Zap,
    },
  ];

  return (
    <Card className="flex flex-col h-full border-border/50 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Smart Recommendations</CardTitle>
        <CardDescription>
          AI-generated opportunities based on your data
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-lg bg-muted/50 border border-border/50 flex flex-col gap-3 group hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <rec.icon className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">{rec.title}</h4>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {rec.impact}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{rec.description}</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-fit p-0 h-auto text-primary group-hover:underline"
            >
              Draft Campaign <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
