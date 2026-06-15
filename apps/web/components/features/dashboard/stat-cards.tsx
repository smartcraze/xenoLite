import { Card, CardContent } from "@/components/ui/card";
import { Users, Send, CheckCircle, Eye, MousePointerClick } from "lucide-react";

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
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50 bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-md">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className={`text-xs mt-4 font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
