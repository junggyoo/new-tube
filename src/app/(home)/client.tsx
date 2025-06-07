"use client";

import { trpc } from "@/trpc/client";

export function PageClient() {
	const [data] = trpc.hello.useSuspenseQuery({ text: "jungq" });

	return <div>Page client says: {data.greeting}</div>;
}
