import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LiveActivity() {
  const activities = [
    {
      id: 1,
      user: "Sarah Jenkins",
      avatar: "https://i.pravatar.cc/150?img=1",
      action: "clicked link in",
      target: "Summer Promo SMS",
      time: "2 mins ago",
    },
    {
      id: 2,
      user: "Mike Ross",
      avatar: "https://i.pravatar.cc/150?img=11",
      action: "made a purchase after",
      target: "Win-back Email",
      time: "15 mins ago",
    },
    {
      id: 3,
      user: "System",
      avatar: "",
      action: "started sending",
      target: "Flash Sale Campaign",
      time: "1 hour ago",
    },
    {
      id: 4,
      user: "Elena Gilbert",
      avatar: "https://i.pravatar.cc/150?img=5",
      action: "read",
      target: "Welcome WhatsApp",
      time: "2 hours ago",
    },
  ];

  return (
    <Card className="flex flex-col h-full border-border/50 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Activity
        </CardTitle>
        <CardDescription>Real-time customer interactions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={activity.avatar} alt={activity.user} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {activity.user.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm">
                <span className="font-semibold">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
