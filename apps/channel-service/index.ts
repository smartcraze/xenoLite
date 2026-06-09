import express from "express";
import { z } from "zod";
import { simulateLifecycle } from "./simulate";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

const sendPayloadSchema = z.object({
    communicationId: z.string(),
    message: z.string(),
    channel: z.string(),
});


app.post("/send", (req, res) => {
    try {
        const payload = sendPayloadSchema.parse(req.body);

        res.status(200).json({ success: true, message: "Accepted for delivery" });

        void simulateLifecycle(payload.communicationId);
    } catch (error) {
        res.status(400).json({ success: false, error: "Invalid payload" });
        console.log("[Invalid Payload]", error);
    }
});

app.listen(PORT, () => {
    console.log(`Channel Service mock running on port ${PORT}`);
});
