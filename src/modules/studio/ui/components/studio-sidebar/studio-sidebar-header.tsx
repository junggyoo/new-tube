import Link from "next/link";

import { useUser } from "@clerk/nextjs";

import {
	SidebarHeader,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function StudioSidebarHeader() {
	const { user } = useUser();
	const { state } = useSidebar();

	if (!user) {
		return (
			<SidebarHeader className="flex items-center justify-center pb-4">
				<Skeleton className="size-[112px] rounded-full" />
				<div className="flex flex-col items-center gap-y-2 mt-2">
					<Skeleton className="w-[100px] h-4" />
					<Skeleton className="w-[80px] h-4" />
				</div>
			</SidebarHeader>
		);
	}

	if (state === "collapsed") {
		return (
			<SidebarMenuItem>
				<SidebarMenuButton tooltip="Your profile">
					<UserAvatar
						size="xs"
						name={user.fullName ?? "User"}
						imageUrl={user.imageUrl}
					/>
					<span className="text-sm">Your profile</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	}

	return (
		<SidebarHeader className="flex items-center justify-center pb-4">
			<Link href="/users/current">
				<UserAvatar
					name={user.fullName ?? "User"}
					imageUrl={user.imageUrl ?? ""}
					className="size-[112px] hover:opacity-80 transition-opacity"
				/>
			</Link>
			<div className="flex flex-col items-center gap-y-1 mt-2">
				<p className="text-xs font-medium">Your profile</p>
				<p className="text-sm text-muted-foreground">{user.fullName}</p>
			</div>
		</SidebarHeader>
	);
}
