import Image from "next/image";

import { formatDuration } from "@/lib/utils";

import { THUMBNAIL_PLACEHOLDER } from "../../constants";

interface VideoThumbnailProps {
	title: string;
	imageUrl?: string | null;
	previewUrl?: string | null;
	duration: number;
}

export function VideoThumbnail({
	title,
	imageUrl,
	previewUrl,
	duration,
}: VideoThumbnailProps) {
	return (
		<div className="relative group">
			{/* Thumbnail wrapper */}
			<div className="relative aspect-video w-full overflow-hidden rounded-xl">
				<Image
					src={imageUrl || THUMBNAIL_PLACEHOLDER}
					alt={title}
					fill
					className="size-full object-cover group-hover:opacity-0"
				/>
				<Image
					unoptimized={!!previewUrl}
					src={previewUrl || THUMBNAIL_PLACEHOLDER}
					alt={title}
					fill
					className="size-full object-cover opacity-0 group-hover:opacity-100"
				/>
			</div>
			<div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
				{formatDuration(duration)}
			</div>
		</div>
	);
}
