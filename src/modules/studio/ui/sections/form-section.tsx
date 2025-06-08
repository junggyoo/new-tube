"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	CopyCheckIcon,
	CopyIcon,
	Globe2Icon,
	ImagePlusIcon,
	LockIcon,
	MoreHorizontalIcon,
	RotateCcwIcon,
	SparklesIcon,
	TrashIcon,
} from "lucide-react";

import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { snakeCaseToTitle } from "@/lib/utils";
import { videoUpdateSchema } from "@/db/schema";
import { THUMBNAIL_PLACEHOLDER } from "@/modules/videos/constants";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";

import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";

interface FormSectionProps {
	videoId: string;
}

export function FormSection({ videoId }: FormSectionProps) {
	return (
		<Suspense fallback={<FormSectionSkeleton />}>
			<ErrorBoundary fallback={<div>Error</div>}>
				<FormSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	);
}

function FormSectionSkeleton() {
	return <div>Loading...</div>;
}

function FormSectionSuspense({ videoId }: FormSectionProps) {
	const router = useRouter();
	const utils = trpc.useUtils();

	const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);

	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
	const [categories] = trpc.categories.getMany.useSuspenseQuery();

	const updateVideo = trpc.videos.update.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate();
			utils.studio.getOne.invalidate({ id: videoId });
			toast.success("Video updated");
		},
		onError: () => {
			toast.error("Something went wrong", {
				description: "Please try again",
			});
		},
	});

	const removeVideo = trpc.videos.remove.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate();
			toast.success("Video removed");
			router.push("/studio");
		},
		onError: () => {
			toast.error("Something went wrong");
		},
	});

	const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate();
			utils.studio.getOne.invalidate({ id: videoId });
			toast.success("Thumbnail restored");
		},
		onError: () => {
			toast.error("Something went wrong");
		},
	});

	const form = useForm<z.infer<typeof videoUpdateSchema>>({
		resolver: zodResolver(videoUpdateSchema),
		defaultValues: video,
	});

	const handleUpdateSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
		updateVideo.mutate(data);
	};

	// TODO: Change if deploying outide of VERCEL
	const fullUrl = `${
		process.env.VERCEL_URL || "http://localhost:3000"
	}/videos/${videoId}`;
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(fullUrl);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	};

	return (
		<>
			<ThumbnailUploadModal
				videoId={videoId}
				open={thumbnailModalOpen}
				onOpenChange={setThumbnailModalOpen}
			/>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleUpdateSubmit)}
					className="space-y-6"
				>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold">Viedo details</h1>
							<h1 className="text-sm text-muted-foreground">
								Manage your video details
							</h1>
						</div>
						<div className="flex items-center gap-x-2">
							<Button type="submit" disabled={updateVideo.isPending}>
								Save
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost">
										<MoreHorizontalIcon className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => removeVideo.mutate({ id: videoId })}
										disabled={removeVideo.isPending}
									>
										<TrashIcon className="size-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
						<div className="space-y-8 lg:col-span-3">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Title
											{/* TODO: Add AI generate button */}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Add a title to your video"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Description
											{/* TODO: Add AI generate button */}
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												value={field.value ?? ""}
												rows={10}
												className="resize-none pr-10"
												placeholder="Add a description to your video"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="thumbnailUrl"
								render={() => (
									<FormItem>
										<FormLabel>Thumbnail</FormLabel>
										<FormControl>
											<div className="p-0.5 border border-dashed border-neutral400 relative h-[84px] w-[153px] group">
												<Image
													src={video.thumbnailUrl || THUMBNAIL_PLACEHOLDER}
													className="object-cover"
													fill
													alt="Thumbnail"
												/>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															type="button"
															size="icon"
															className="absolute top-1 right-1 bg-black/50 hover:bg-black/50 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
														>
															<MoreHorizontalIcon className="size-4 text-white" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="start" side="right">
														<DropdownMenuItem
															onClick={() => setThumbnailModalOpen(true)}
														>
															<ImagePlusIcon className="size-4 mr-1" />
															Change
														</DropdownMenuItem>
														<DropdownMenuItem>
															<SparklesIcon className="size-4 mr-1" />
															AI-generated
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																restoreThumbnail.mutate({ id: videoId })
															}
															disabled={restoreThumbnail.isPending}
														>
															<RotateCcwIcon className="size-4 mr-1" />
															Restore
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Category
											{/* TODO: Add AI generate button */}
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col gap-y-8 lg:col-span-2">
							<div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
								<div className="aspect-video overflow-hidden relative">
									<VideoPlayer
										playbackId={video.muxPlaybackId}
										thumbnailUrl={video.thumbnailUrl}
									/>
								</div>
								<div className="p-4 flex flex-col gap-y-6">
									<div className="flex items-center justify-between gap-x-2">
										<div className="flex flex-col gap-y-1">
											<p className="text-muted-foreground text-xs">
												Video link
											</p>
											<div className="flex items-center gap-x-2">
												<Link href={`/videos/${video.id}`}>
													<p className="line-clamp-1 text-sm text-blue-500">
														{fullUrl}
													</p>
												</Link>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="shrink-0"
													onClick={handleCopy}
													disabled={isCopied}
												>
													{isCopied ? (
														<CopyCheckIcon className="text-green-500" />
													) : (
														<CopyIcon />
													)}
												</Button>
											</div>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div className="flex flex-col gap-y-1">
											<p className="text-muted-foreground text-xs">
												Video status
											</p>
											<p className="text-sm">
												{snakeCaseToTitle(video.muxStatus || "Preparing")}
											</p>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div className="flex flex-col gap-y-1">
											<p className="text-muted-foreground text-xs">
												Subtitles status
											</p>
											<p className="text-sm">
												{snakeCaseToTitle(
													video.muxTrackStatus || "No subtitles"
												)}
											</p>
										</div>
									</div>
								</div>
							</div>
							<FormField
								control={form.control}
								name="visibility"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Visibility</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a visibility" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="public">
													<div className="flex items-center gap-x-2">
														<Globe2Icon className="size-4" />
														Public
													</div>
												</SelectItem>
												<SelectItem value="private">
													<div className="flex items-center gap-x-2">
														<LockIcon className="size-4" />
														Private
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
}
