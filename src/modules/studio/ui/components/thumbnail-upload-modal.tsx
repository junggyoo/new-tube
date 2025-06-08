import { trpc } from "@/trpc/client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ResponsiveModal } from "@/components/responsive-modal";

interface ThumbnailUploadModalProps {
	videoId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ThumbnailUploadModal({
	videoId,
	open,
	onOpenChange,
}: ThumbnailUploadModalProps) {
	const utils = trpc.useUtils();

	const handleUploadComplete = () => {
		utils.studio.getMany.invalidate();
		utils.studio.getOne.invalidate({ id: videoId });
		onOpenChange(false);
	};

	return (
		<ResponsiveModal
			title="Upload a Thumbnail"
			open={open}
			onOpenChange={onOpenChange}
		>
			<UploadDropzone
				input={{ videoId }}
				endpoint="thumbnailUploader"
				onClientUploadComplete={handleUploadComplete}
			/>
		</ResponsiveModal>
	);
}
