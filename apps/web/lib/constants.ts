export const APP_CONFIG = {
  NAME: "XenoLite CRM",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  PRO_PLAN_LIMIT: 50000,
  SUPPORT_EMAIL: "support@xenolite.com",
};

export const SIDEBAR_ITEMS = [
  { title: "Dashboard", iconName: "Home", url: "/dashboard" },
  { title: "AI Copilot", iconName: "Sparkles", url: "/dashboard/ai-copilot" },
  { title: "Campaigns", iconName: "Send", url: "/dashboard/campaigns" },
  { title: "Customers", iconName: "Users", url: "/dashboard/customers" },
  { title: "Analytics", iconName: "BarChart3", url: "/dashboard/analytics" },
  { title: "Messages", iconName: "MessageSquare", url: "/dashboard/messages" },
  { title: "Integrations", iconName: "LayoutGrid", url: "/dashboard/integrations" },
  { title: "Settings", iconName: "Settings", url: "/dashboard/settings" },
];
