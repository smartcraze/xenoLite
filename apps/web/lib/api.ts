import { APP_CONFIG } from "./constants";

/**
 * Basic fetch wrapper for server components and client requests
 */
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  let token = "";

  if (typeof window === "undefined") {
    // Server-side
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value || "";
  } else {
    // Client-side
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    if (match) token = match[2];
  }

  const url = `${APP_CONFIG.API_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMsg = errorBody.message || `API Error: ${response.status}`;
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Campaigns
  getCampaigns: () => fetchApi("/campaigns"),
  getCampaign: (id: string) => fetchApi(`/campaigns/${id}`),
  createCampaign: (data: any) =>
    fetchApi("/campaigns", { method: "POST", body: JSON.stringify(data) }),
  sendCampaign: (id: string) =>
    fetchApi(`/campaigns/${id}/send`, { method: "POST" }),

  // Analytics
  getAnalytics: (campaignId: string) => fetchApi(`/analytics/${campaignId}`),

  // AI
  segmentAudience: (data: any) =>
    fetchApi("/ai/segment", { method: "POST", body: JSON.stringify(data) }),
  generateMessage: (data: any) =>
    fetchApi("/ai/message", { method: "POST", body: JSON.stringify(data) }),

  // Customers
  getCustomers: () => fetchApi("/customers"),

  getDashboardStats: async () => {
    let campaigns: any[] = [];
    let customers: any[] = [];
    try {
      const [campaignsResult, customersResult] = await Promise.all([
        fetchApi("/campaigns"),
        fetchApi("/customers"),
      ]);
      campaigns = campaignsResult.data?.campaigns || [];
      customers = customersResult.data?.customers || [];
    } catch (e: any) {
      console.log("Stats fetch error:", e);
      // Propagate the error so the page can handle 401
      throw e;
    }

    const totalCustomers = customers.length;
    const campaignsSent = campaigns.length;

    let sent = 0;
    let delivered = 0;
    let read = 0;
    let clicked = 0;
    const converted = 0; // The backend doesn't track 'converted' directly yet, but we'll include it in the funnel for UI completeness.

    // Fetch analytics for all campaigns to aggregate
    if (campaigns.length > 0) {
      try {
        const analyticsPromises = campaigns.map((c) =>
          fetchApi(`/analytics/${c.id}`).catch(() => ({ data: null })),
        );
        const analyticsResults = await Promise.all(analyticsPromises);

        for (const res of analyticsResults) {
          if (res.data && res.data.metrics) {
            sent += res.data.metrics.sent || 0;
            delivered += res.data.metrics.delivered || 0;
            read += res.data.metrics.read || 0;
            clicked += res.data.metrics.clicked || 0;
          }
        }
      } catch (e) {
        console.log("Analytics aggregation error:", e);
      }
    }

    const successfulSent = sent + delivered + read + clicked;
    const deliveryRate =
      successfulSent > 0
        ? ((delivered + read + clicked) / successfulSent) * 100
        : 0;
    const readRate =
      delivered + read + clicked > 0
        ? ((read + clicked) / (delivered + read + clicked)) * 100
        : 0;
    // Calculate click rate based on total target/successful sent since CTR is clicks / deliveries usually
    const clickRate =
      delivered + read + clicked > 0
        ? (clicked / (delivered + read + clicked)) * 100
        : 0;

    // For the UI Funnel, we need the raw accumulated totals (cascade representation)
    const funnelSent = successfulSent;
    const funnelDelivered = delivered + read + clicked;
    const funnelRead = read + clicked;
    const funnelClicked = clicked;

    // Converted is mocked as a fraction of clicked since the backend doesn't have an order tracking integration yet
    const funnelConverted = Math.floor(clicked * 0.4);

    const funnelData = [
      { name: "Sent", value: funnelSent, percentage: funnelSent > 0 ? 100 : 0 },
      {
        name: "Delivered",
        value: funnelDelivered,
        percentage:
          funnelSent > 0
            ? Math.round((funnelDelivered / funnelSent) * 1000) / 10
            : 0,
      },
      {
        name: "Read",
        value: funnelRead,
        percentage:
          funnelSent > 0
            ? Math.round((funnelRead / funnelSent) * 1000) / 10
            : 0,
      },
      {
        name: "Clicked",
        value: funnelClicked,
        percentage:
          funnelSent > 0
            ? Math.round((funnelClicked / funnelSent) * 1000) / 10
            : 0,
      },
      {
        name: "Converted",
        value: funnelConverted,
        percentage:
          funnelSent > 0
            ? Math.round((funnelConverted / funnelSent) * 1000) / 10
            : 0,
      },
    ];

    return {
      totalCustomers,
      campaignsSent,
      deliveryRate: Math.round(deliveryRate * 10) / 10,
      readRate: Math.round(readRate * 10) / 10,
      clickRate: Math.round(clickRate * 10) / 10,
      recentCampaigns: campaigns.slice(0, 5),
      funnelData,
    };
  },
};
