"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";

import { UserNav } from "./user-nav";

export function WorkspaceHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Logo & Brand */}
                <Link
                    href="/"
                    className="flex items-center gap-3 group focus:outline-none"
                >
                    <div className="size-10 rounded-2xl bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                        <BookOpen className="size-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text">
                                ChaiBook
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                AI LM
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground -mt-0.5 hidden sm:block">
                            Personal AI Knowledge Notebooks
                        </p>
                    </div>
                </Link>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <CreateWorkspaceDialog />
                    <ModeToggle />
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
