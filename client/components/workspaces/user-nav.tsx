"use client";

import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

export function UserNav() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="size-8 rounded-full bg-muted/60 animate-pulse" />
        );
    }

    if (!session?.user) {
        return (
            <Link href="/sign-in">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl text-xs h-8 shadow-sm"
                >
                    <LogIn className="size-3.5" />
                    <span>Sign In</span>
                </Button>
            </Link>
        );
    }

    const user = session.user;
    const initials = user.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/sign-in";
                },
            },
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all p-0 overflow-hidden"
                    />
                }
            >
                <Avatar className="size-8">
                    {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                <DropdownMenuLabel className="p-2">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none truncate">
                            {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground leading-none truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer rounded-xl p-2"
                >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
