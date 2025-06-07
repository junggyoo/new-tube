"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface FilterCarouselProps {
	value?: string | null;
	isLoading?: boolean;
	data: {
		label: string;
		value: string;
	}[];
	onSelect: (value: string | null) => void;
}

export function FilterCarousel({
	value,
	isLoading,
	data,
	onSelect,
}: FilterCarouselProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<div className="relative w-full">
			{/* Left fade */}
			<div
				className={cn(
					"absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent",
					current === 1 && "hidden"
				)}
			/>

			<Carousel
				setApi={setApi}
				opts={{
					align: "start",
					dragFree: true,
				}}
				className="w-full px-12"
			>
				<CarouselContent className="-ml-3">
					{!isLoading && (
						<CarouselItem
							className="pl-3 basis-auto"
							onClick={() => onSelect(null)}
						>
							<Badge
								variant={!value ? "default" : "secondary"}
								className="rounded-lg px-3 py-1 whitespace-nowrap text-sm cursor-pointer"
							>
								All
							</Badge>
						</CarouselItem>
					)}
					{isLoading &&
						Array.from({ length: 14 }).map((_, index) => (
							<CarouselItem key={index} className="pl-3 basis-auto">
								<Skeleton className="rounded-lg px-3 py-1 h-full text-sm w-[100px] font-semibold">
									&nbsp;
								</Skeleton>
							</CarouselItem>
						))}
					{!isLoading &&
						data.map((item) => (
							<CarouselItem
								key={item.value}
								className="pl-3 basis-auto"
								onClick={() => onSelect(item.value)}
							>
								<Badge
									variant={value === item.value ? "default" : "secondary"}
									className="rounded-lg px-3 py-1 whitespace-nowrap text-sm cursor-pointer"
								>
									{item.label}
								</Badge>
							</CarouselItem>
						))}
				</CarouselContent>
				<CarouselPrevious className="left-0" />
				<CarouselNext className="right-0" />
			</Carousel>
			{/* Right fade */}
			<div
				className={cn(
					"absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent",
					current === count && "hidden"
				)}
			/>
		</div>
	);
}
