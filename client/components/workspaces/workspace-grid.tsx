"use client";

import { useState } from "react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { WorkspaceCard } from "./workspace-card";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    BookPlus,
    Sparkles,
    Library,
    Layers,
    FolderKanban,
} from "lucide-react";

export function WorkspaceGrid() {
    const { data: workspaces, isLoading, error } = useWorkspaces();
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = (workspaces || []).filter(
        (ws) =>
            ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ws.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search notebooks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-card/50 border-border/60 rounded-2xl h-10"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/40 font-medium">
                        <FolderKanban className="size-3.5 text-primary" />
                        {workspaces?.length || 0} Workspaces
                    </span>
                </div>
            </div>

            {/* Content States */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="h-48 rounded-[24px] bg-muted/20 border border-border/40 animate-pulse p-6 flex flex-col justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-2xl bg-muted/40" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-muted/40 rounded w-2/3" />
                                    <div className="h-3 bg-muted/30 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="h-3 bg-muted/30 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="p-8 text-center rounded-[24px] border border-destructive/20 bg-destructive/5 text-destructive space-y-2">
                    <p className="font-semibold text-base">
                        Failed to load workspaces
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "Please check your server connection or log in."}
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-[28px] border border-dashed border-border/80 bg-card/20 backdrop-blur-sm space-y-4">
                    <div className="size-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                        <Library className="size-8" />
                    </div>
                    <div className="space-y-1.5 max-w-sm mx-auto">
                        <h3 className="text-lg font-bold">
                            {searchQuery
                                ? "No matching workspaces"
                                : "No workspaces yet"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {searchQuery
                                ? `No notebooks matched "${searchQuery}". Try a different keyword.`
                                : "Create your first workspace to start uploading documents, URLs, and chatting with your AI assistant."}
                        </p>
                    </div>
                    {!searchQuery && (
                        <div className="pt-2">
                            <CreateWorkspaceDialog
                                trigger={
                                    <Button className="gap-2 shadow-lg shadow-primary/20">
                                        <BookPlus className="size-4" />
                                        <span>Create Your First Workspace</span>
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((workspace) => (
                        <WorkspaceCard
                            key={workspace.id}
                            workspace={workspace}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
