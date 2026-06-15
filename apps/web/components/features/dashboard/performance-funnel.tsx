import { Eye, Mail, MousePointerClick, Send, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PerformanceFunnel({ data }: { data?: any }) {
  const layerStyles = [
    {
      icon: Send,
      text: "text-purple-400",
      bg: "bg-purple-500",
      iconBg: "bg-purple-500/10",
    },
    {
      icon: Mail,
      text: "text-indigo-400",
      bg: "bg-indigo-500",
      iconBg: "bg-indigo-500/10",
    },
    {
      icon: Eye,
      text: "text-blue-400",
      bg: "bg-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: MousePointerClick,
      text: "text-emerald-400",
      bg: "bg-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      icon: ShoppingCart,
      text: "text-lime-400",
      bg: "bg-lime-500",
      iconBg: "bg-lime-500/10",
    },
  ];

  const rawFunnelData = data?.funnelData || [];

  // Fixed visual widths to ensure a perfect pyramid shape regardless of exact data skew
  const visualWidths = [100, 85, 65, 40, 25];

  if (rawFunnelData.length === 0 || rawFunnelData[0].value === 0) {
    return (
      <Card className="flex flex-col h-full border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-lg font-semibold">
            Campaign Performance Funnel
          </CardTitle>
          <div className="text-xs font-medium border border-border px-3 py-1.5 rounded-md text-muted-foreground bg-background/50 cursor-pointer hover:bg-muted/50 transition-colors">
            This Week v
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center items-center px-6 pb-8">
          <div className="text-sm text-muted-foreground">
            Not enough data to generate funnel. Send a campaign!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full border-border/50 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-lg font-semibold">
          Campaign Performance Funnel
        </CardTitle>
        <div className="text-xs font-medium border border-border px-3 py-1.5 rounded-md text-muted-foreground bg-background/50 cursor-pointer hover:bg-muted/50 transition-colors">
          This Week v
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center px-6 pb-8 gap-0">
        {rawFunnelData.map((step: any, index: number) => {
          const style = layerStyles[index % layerStyles.length];
          const Icon = style.icon;

          const topW = visualWidths[index];
          // Bottom width matches the top width of the next layer, or tapers off slightly for the last one
          const bottomW =
            index < visualWidths.length - 1
              ? visualWidths[index + 1]
              : visualWidths[index] * 0.8;

          const tl = (100 - topW) / 2;
          const tr = 100 - tl;
          const bl = (100 - bottomW) / 2;
          const br = 100 - bl;

          const clipPath = `polygon(${tl}% 0%, ${tr}% 0%, ${br}% 100%, ${bl}% 100%)`;

          return (
            <div
              key={step.name}
              className="flex items-center w-full mb-1 group relative h-12"
            >
              {/* Left Side: Icon + Name */}
              <div className="flex items-center gap-3 w-[25%] min-w-[120px] z-10">
                <div
                  className={`h-8 w-8 rounded-md flex items-center justify-center ${style.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${style.text}`} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {step.name}
                </span>
              </div>

              {/* Absolute Value */}
              <div
                className={`w-[15%] text-right pr-6 text-sm font-semibold tabular-nums ${style.text} z-10`}
              >
                {step.value.toLocaleString()}
              </div>

              {/* Middle Funnel Shape */}
              <div className="flex-1 h-full flex justify-center items-center relative z-0">
                <div
                  className={`absolute inset-0 h-full w-full ${style.bg} hover:opacity-90 transition-opacity`}
                  style={{ clipPath }}
                />
              </div>

              {/* Right Side: Percentage */}
              <div
                className={`w-[20%] text-right pl-6 text-sm font-bold tabular-nums ${style.text} z-10`}
              >
                {step.percentage}%
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
