"use client";

import { ClapperboardIcon, UserCircleIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function AuthButton() {
	// TODO: Add different auth states
	return (
		<>
			<SignedIn>
				<UserButton>
					<UserButton.MenuItems>
						{/* TODO: Add User profile menu button*/}
						<UserButton.Link
							href="/studio"
							label="Studio"
							labelIcon={<ClapperboardIcon className="size-4" />}
						/>
						<UserButton.Action label="manageAccount" />
					</UserButton.MenuItems>
				</UserButton>
			</SignedIn>
			<SignedOut>
				<SignInButton mode="modal">
					<Button
						variant="outline"
						className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-600 border-blue-500/20 rounded-full shadow-none"
					>
						<UserCircleIcon className="size-4 mr-2" />
						Sign in
					</Button>
				</SignInButton>
			</SignedOut>
		</>
	);
}
