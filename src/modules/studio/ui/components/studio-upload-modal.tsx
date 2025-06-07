"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StudioUploadModal() {
	return (
		<Button variant="secondary">
			<PlusIcon className="size-4" />
			Create
		</Button>
	);
}
