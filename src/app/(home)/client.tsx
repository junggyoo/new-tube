"use client";

import { trpc } from "@/trpc/client";

export function PageClient() {
	const [data] = trpc.categories.getMany.useSuspenseQuery();

	return (
		<div>
			<h1>Categories</h1>
			<ul>
				{data.map((category) => (
					<li key={category.id}>{category.name}</li>
				))}
			</ul>
		</div>
	);
}
