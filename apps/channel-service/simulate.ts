

const WEBHOOK_URL =
    process.env.WEBHOOK_URL || "http://localhost:3000/api/v1/webhooks/status";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


async function sendWebhook(communicationId: string, status: string) {
    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ communicationId, status }),
        });
        console.log(`[Webhook -> CRM] ${status} for ${communicationId}`);
    } catch (err) {
        console.error(
            `[Webhook Failed] Could not send ${status} to CRM for ${communicationId}:`,
            err,
        );
    }
}



export async function simulateLifecycle(communicationId: string) {
    console.log(`[Simulator] Starting lifecycle for ${communicationId}`);

    // 1. SENT (always happens after 1-2s)
    await delay(1000 + Math.random() * 1000);
    await sendWebhook(communicationId, "SENT");

    // 2. DELIVERED or FAILED
    await delay(2000 + Math.random() * 3000); // 2-5 seconds
    const isFailed = Math.random() < 0.1; // 10% fail rate
    if (isFailed) {
        await sendWebhook(communicationId, "FAILED");
        return; // Lifecycle ends
    }
    await sendWebhook(communicationId, "DELIVERED");

    // 3. READ
    await delay(5000 + Math.random() * 10000); // 5-15 seconds
    const isRead = Math.random() < 0.5; // 50% read rate
    if (!isRead) return; // Never read
    await sendWebhook(communicationId, "READ");

    // 4. CLICKED
    await delay(5000 + Math.random() * 5000); // 5-10 seconds
    const isClicked = Math.random() < 0.2; // 20% click rate if read
    if (!isClicked) return;
    await sendWebhook(communicationId, "CLICKED");
}