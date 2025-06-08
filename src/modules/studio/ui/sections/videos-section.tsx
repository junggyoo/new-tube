"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export function VideosSection() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ErrorBoundary fallback={<div>Error</div>}>
				<VideosSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	);
}

function VideosSectionSuspense() {
	const [videos, { hasNextPage, isFetchingNextPage, fetchNextPage }] =
		trpc.studio.getMany.useSuspenseInfiniteQuery(
			{
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		);

	return (
		<div>
			<div className="border-y">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="pl-6 w-[510px]">Video</TableHead>
							<TableHead>Visibility</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Views</TableHead>
							<TableHead className="text-right">Comments</TableHead>
							<TableHead className="text-right">Likes</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{videos.pages.flatMap((page) =>
							page.items.map((video) => (
								<Link
									key={video.id}
									href={`/studio/videos/${video.id}`}
									legacyBehavior
								>
									<TableRow className="cursor-pointer">
										<TableCell>{video.title}</TableCell>
										<TableCell>visibility</TableCell>
										<TableCell>status</TableCell>
										<TableCell>date</TableCell>
										<TableCell>views</TableCell>
										<TableCell>comments</TableCell>
										<TableCell>likes</TableCell>
									</TableRow>
								</Link>
							))
						)}
					</TableBody>
				</Table>
			</div>
			<InfiniteScroll
				isManual
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
			/>
		</div>
	);
}
