"use client";

import { CheckCircle, Eye, MousePointerClick, Send, Users } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// Dummy data generator for sparklines to simulate trend
const generateSparklineData = (isPositive: boolean) => {
  return Array.from({ length: 10 }).map((_, i) => {
    // Generate a trending curve: positive goes up, negative goes down
    const base = isPositive ? 20 + i * 5 : 80 - i * 5;
    return { value: base + Math.random() * 15 };
  });
};

export function StatCards({ data }: { data?: any }) {
  const stats = [
    {
      title: "Total Customers",
      value: data?.totalCustomers?.toLocaleString() || "0",
      change: "+12%",
      icon: Users,
    },
    {
      title: "Campaigns Sent",
      value: data?.campaignsSent?.toLocaleString() || "0",
      change: "+3 this week",
      icon: Send,
    },
    {
      title: "Delivery Rate",
      value: `${data?.deliveryRate || 0}%`,
      change: "+0.5%",
      icon: CheckCircle,
    },
    {
      title: "Read Rate",
      value: `${data?.readRate || 0}%`,
      change: "+2.1%",
      icon: Eye,
    },
    {
      title: "Click Rate",
      value: `${data?.clickRate || 0}%`,
      change: "-0.4%",
      icon: MousePointerClick,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const isPositive = stat.change.startsWith("+");
        const color = isPositive ? "#22c55e" : "#ef4444"; // tailwind green-500 and red-500
        const sparklineData = generateSparklineData(isPositive);

        return (
          <Card
            key={index}
            className="border-border/50 bg-card overflow-hidden relative group"
          >
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-md">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p
                className={`text-xs mt-4 font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {stat.change}
              </p>
            </CardContent>

            {/* Sparkline Area Graph at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient
                      id={`gradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#gradient-${index})`}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
