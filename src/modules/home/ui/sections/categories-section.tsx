"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { FilterCarousel } from "@/components/filter-carousel";

interface CategoriesSectionProps {
	categoryId?: string;
}

export function CategoriesSection({ categoryId }: CategoriesSectionProps) {
	return (
		<Suspense fallback={<CategoriesSectionSkeleton />}>
			<ErrorBoundary fallback={<div>Error...</div>}>
				<CategoriesSectionSuspense categoryId={categoryId} />
			</ErrorBoundary>
		</Suspense>
	);
}

function CategoriesSectionSkeleton() {
	return <FilterCarousel data={[]} onSelect={() => {}} isLoading />;
}

function CategoriesSectionSuspense({ categoryId }: CategoriesSectionProps) {
	const router = useRouter();

	const [categories] = trpc.categories.getMany.useSuspenseQuery();

	const data = categories.map((category) => ({
		label: category.name,
		value: category.id,
	}));

	const handleSelect = (value: string | null) => {
		const url = new URL(window.location.href);

		if (value) {
			url.searchParams.set("categoryId", value);
		} else {
			url.searchParams.delete("categoryId");
		}

		router.push(url.toString());
	};

	return (
		<div>
			<FilterCarousel value={categoryId} data={data} onSelect={handleSelect} />
		</div>
	);
}
