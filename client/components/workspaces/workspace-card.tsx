"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Workspace } from "@/lib/api";
import { useDeleteWorkspace } from "@/hooks/use-workspaces";
import { EditWorkspaceDialog } from "./edit-workspace-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    Edit,
    Trash2,
    Copy,
    ArrowUpRight,
    Bot,
    Check,
} from "lucide-react";

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const deleteWorkspace = useDeleteWorkspace();

    const handleCardClick = () => {
        router.push(`/workspaces/${workspace.id}`);
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/workspaces/${workspace.id}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (
            window.confirm(
                `Are you sure you want to delete workspace "${workspace.title}"? All sources and conversations will be removed.`,
            )
        ) {
            deleteWorkspace.mutate(workspace.id);
        }
    };

    const formattedDate = workspace.createdAt
        ? formatDistanceToNow(new Date(workspace.createdAt), {
              addSuffix: true,
          })
        : "recently";

    return (
        <>
            <Card
                onClick={handleCardClick}
                className="group cursor-pointer h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1 bg-card/60 backdrop-blur-md border-border/60 relative overflow-hidden flex flex-col justify-between"
            >
                {/* Top gradient accent glow */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary transition-all duration-500" />

                <div>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 group-hover:bg-primary/15 transition-all">
                                {workspace.icon || "📚"}
                            </div>

                            <div
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                                            />
                                        }
                                    >
                                        <MoreVertical className="size-4 text-muted-foreground" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-44"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => setEditOpen(true)}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <Edit className="size-4" />
                                            <span>Edit Details</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleCopy}
                                            className="gap-2 cursor-pointer"
                                        >
                                            {copied ? (
                                                <Check className="size-4 text-emerald-500" />
                                            ) : (
                                                <Copy className="size-4" />
                                            )}
                                            <span>
                                                {copied
                                                    ? "Link Copied!"
                                                    : "Copy Link"}
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            <Trash2 className="size-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="size-7 rounded-xl flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                                    <ArrowUpRight className="size-4 text-primary" />
                                </div>
                            </div>
                        </div>

                        <CardTitle className="text-lg font-bold mt-3 group-hover:text-primary transition-colors line-clamp-1">
                            {workspace.title}
                        </CardTitle>
                        {workspace.description && (
                            <CardDescription className="line-clamp-2 mt-1 text-xs text-muted-foreground/80 leading-relaxed">
                                {workspace.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                </div>

                <CardFooter className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 rounded-lg bg-muted/50 border border-border/50 font-normal flex items-center gap-1"
                        >
                            <Bot className="size-3 text-primary/70" />
                            <span className="truncate max-w-[110px]">
                                {workspace.defaultModel || "mistral-small"}
                            </span>
                        </Badge>
                    </div>
                    <span className="text-[11px]">{formattedDate}</span>
                </CardFooter>
            </Card>

            <EditWorkspaceDialog
                workspace={workspace}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}
