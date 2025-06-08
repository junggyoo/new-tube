import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import {
	VideoAssetCreatedWebhookEvent,
	VideoAssetErroredWebhookEvent,
	VideoAssetReadyWebhookEvent,
	VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";

import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type MuxWebhookEvent =
	| VideoAssetCreatedWebhookEvent
	| VideoAssetErroredWebhookEvent
	| VideoAssetReadyWebhookEvent
	| VideoAssetTrackReadyWebhookEvent;

export const POST = async (req: Request) => {
	if (!SIGNING_SECRET) {
		throw new Error("Missing MUX_WEBHOOK_SECRET is not set");
	}

	const headersPlayload = await headers();
	const muxSignature = headersPlayload.get("mux-signature");

	if (!muxSignature) {
		return new Response("No signature found", { status: 401 });
	}

	const payload = await req.json();
	const body = JSON.stringify(payload);

	mux.webhooks.verifySignature(
		body,
		{
			"mux-signature": muxSignature,
		},
		SIGNING_SECRET
	);

	switch (payload.type as MuxWebhookEvent["type"]) {
		case "video.asset.created": {
			const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

			if (!data.upload_id) {
				return new Response("No upload ID found", { status: 400 });
			}

			await db
				.update(videos)
				.set({
					muxAssetId: data.id,
					muxStatus: data.status,
				})
				.where(eq(videos.muxUploadId, data.upload_id));

			break;
		}

		case "video.asset.errored":
			break;
		case "video.asset.ready":
			break;
	}

	return new Response("Webhook received", { status: 200 });
};
