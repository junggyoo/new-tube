"use client";

import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
	playbackId?: string | null;
	thumbnailUrl?: string | null;
	autoPlay?: boolean;
	onPlay?: () => void;
}

export function VideoPlayer({
	playbackId,
	thumbnailUrl,
	autoPlay,
	onPlay,
}: VideoPlayerProps) {
	return (
		<MuxPlayer
			playbackId={playbackId || ""}
			poster={thumbnailUrl || "/placeholder.svg"}
			playerInitTime={0}
			thumbnailTime={0}
			autoPlay={autoPlay}
			className="w-full h-full object-contain"
			accentColor="#FF2056"
			onPlay={onPlay}
		/>
	);
}
