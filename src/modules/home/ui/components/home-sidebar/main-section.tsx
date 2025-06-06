"use client";

import Link from "next/link";
import { HomeIcon, PlaySquareIcon, FlameIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

const items = [
	{
		title: "Home",
		url: "/",
		icon: HomeIcon,
	},
	{
		title: "Suscripciones",
		url: "/feed/subscriptions",
		icon: PlaySquareIcon,
		auth: true,
	},
	{
		title: "Trending",
		url: "/feed/trending",
		icon: FlameIcon,
	},
];

export function MainSection() {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive={false} // TODO: Change to look at the current pathname
								onClick={() => {}} // TODO: Add onClick
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
