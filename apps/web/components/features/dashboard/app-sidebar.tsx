import {
  BarChart3,
  Home,
  LayoutGrid,
  MessageSquare,
  Send,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { APP_CONFIG, SIDEBAR_ITEMS } from "@/lib/constants";

// Map icon strings back to actual Lucide components dynamically if needed,
// but since we want to avoid complex mapping, we'll map them here:
const iconMap: Record<string, any> = {
  Home,
  Sparkles,
  Send,
  Users,
  BarChart3,
  MessageSquare,
  LayoutGrid,
  Settings,
};

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="py-6 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt={APP_CONFIG.NAME}
            width={160}
            height={160}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = iconMap[item.iconName] || Home;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="hover:bg-primary/10 hover:text-primary py-6 px-4 text-muted-foreground transition-all"
                    >
                      <Link href={item.url}>
                        <Icon className="h-5 w-5" />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="bg-muted/50 rounded-lg p-4 border border-border/50 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary">👑</span>
            <span className="font-semibold text-sm">Pro Plan</span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            12,490 / 50,000 messages
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[25%]" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 px-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate">Aarav Mehta</span>
            <span className="text-xs text-muted-foreground truncate">
              aarav@xenolite.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
