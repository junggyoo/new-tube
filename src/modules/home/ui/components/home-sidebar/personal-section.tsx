"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { HistoryIcon, ThumbsUpIcon, ListVideoIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarGroupLabel,
} from "@/components/ui/sidebar";

const items = [
	{
		title: "History",
		url: "/playlists/history",
		icon: HistoryIcon,
		auth: true,
	},
	{
		title: "Liked videos",
		url: "/playlists/liked",
		icon: ThumbsUpIcon,
		auth: true,
	},
	{
		title: "All playlists",
		url: "/playlists",
		icon: ListVideoIcon,
		auth: true,
	},
];

export function PersonalSection() {
	const { isSignedIn } = useAuth();
	const clerk = useClerk();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Personal</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive={false} // TODO: Change to look at the current pathname
								onClick={(e) => {
									if (!isSignedIn && item.auth) {
										e.preventDefault();
										return clerk.openSignIn();
									}
								}}
							>
								<Link href={item.url} className="flex items-center gap-4">
									<item.icon />
									<span className="text-sm">{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
