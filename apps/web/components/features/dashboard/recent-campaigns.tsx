import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentCampaigns({ data }: { data?: any[] }) {
  const campaigns = data && data.length > 0 ? data : [];

  if (campaigns.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>
            Overview of your latest marketing efforts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm">
          No campaigns found. Create your first campaign to see it here!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
        <CardDescription>
          Overview of your latest marketing efforts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Sent</TableHead>
              <TableHead className="text-right">Open Rate</TableHead>
              <TableHead className="text-right">Click Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} className="border-border/50">
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      campaign.status === "Active" ||
                      campaign.status === "running"
                        ? "border-green-500/50 text-green-500 bg-green-500/10"
                        : campaign.status === "Completed" ||
                            campaign.status === "completed"
                          ? "border-blue-500/50 text-blue-500 bg-blue-500/10"
                          : "border-border text-muted-foreground"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {campaign.sent || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {campaign.openRate || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {campaign.clickRate || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
