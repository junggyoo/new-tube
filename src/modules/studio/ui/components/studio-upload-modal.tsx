"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon, PlusIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";

import { StudioUploader } from "./studio-uploader";

export function StudioUploadModal() {
	const router = useRouter();
	const utils = trpc.useUtils();
	const create = trpc.videos.create.useMutation({
		onSuccess: () => {
			toast.success("Video created");
			utils.studio.getMany.invalidate();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSuccess = () => {
		if (!create.data?.video.id) {
			return;
		}

		create.reset();
		router.push(`/studio/videos/${create.data.video.id}`);
	};

	return (
		<>
			<ResponsiveModal
				open={!!create.data?.url}
				title="Upload a video"
				onOpenChange={() => create.reset()}
			>
				{create.data?.url ? (
					<StudioUploader
						endpoint={create.data?.url}
						onSuccess={handleSuccess}
					/>
				) : (
					<Loader2Icon className="animate-spin" />
				)}
			</ResponsiveModal>
			<Button
				variant="secondary"
				onClick={() => create.mutate()}
				disabled={create.isPending}
			>
				{create.isPending ? (
					<Loader2Icon className="animate-spin" />
				) : (
					<PlusIcon />
				)}
				Create
			</Button>
		</>
	);
}
