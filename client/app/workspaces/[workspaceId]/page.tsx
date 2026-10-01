"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkspace, useDeleteWorkspace } from "@/hooks/use-workspaces";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { EditWorkspaceDialog } from "@/components/workspaces/edit-workspace-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Bot,
    Edit3,
    Trash2,
    Layers,
    MessageSquare,
    Sparkles,
    FileText,
    BookOpen,
    Loader2,
} from "lucide-react";

export default function WorkspaceDetailPage({
    params,
}: {
    params: Promise<{ workspaceId: string }>;
}) {
    const { workspaceId } = use(params);
    const router = useRouter();
    const { data: workspace, isLoading, error } = useWorkspace(workspaceId);
    const deleteWorkspace = useDeleteWorkspace();
    const [editOpen, setEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("sources");

    const handleDelete = async () => {
        if (
            window.confirm(
                `Are you sure you want to delete "${workspace?.title}"? All uploaded documents and chat history will be permanently removed.`,
            )
        ) {
            await deleteWorkspace.mutateAsync(workspaceId);
            router.push("/");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm">Loading workspace...</p>
                </div>
            </div>
        );
    }

    if (error || !workspace) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="text-center space-y-4 max-w-md p-8 rounded-3xl border border-destructive/20 bg-destructive/5">
                    <h2 className="text-xl font-bold text-destructive">
                        Workspace Not Found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "This workspace could not be loaded or was removed."}
                    </p>
                    <Link href="/">
                        <Button variant="outline">Back to Workspaces</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex flex-col">
            {/* Top Workspace Navbar */}
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-xl"
                            >
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>

                        <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
                            {workspace.icon || "📚"}
                        </div>

                        <div className="min-w-0">
                            <h1 className="font-heading font-bold text-base sm:text-lg truncate">
                                {workspace.title}
                            </h1>
                            {workspace.description && (
                                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                                    {workspace.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Badge
                            variant="secondary"
                            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs bg-muted/50 border border-border/60"
                        >
                            <Bot className="size-3.5 text-primary" />
                            <span>{workspace.defaultModel}</span>
                        </Badge>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditOpen(true)}
                            className="gap-1.5 rounded-xl h-8 text-xs"
                        >
                            <Edit3 className="size-3.5" />
                            <span className="hidden sm:inline">Settings</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleDelete}
                            className="text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                            <Trash2 className="size-4" />
                        </Button>

                        <ModeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col space-y-6"
                >
                    <div className="border-b border-border/40 pb-3">
                        <TabsList className="bg-muted/40 p-1 rounded-2xl border border-border/40 h-10">
                            <TabsTrigger
                                value="sources"
                                className="gap-2 rounded-xl text-xs sm:text-sm"
                            >
                                <Layers className="size-4 text-primary" />
                                <span>Sources & Data</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="chat"
                                className="gap-2 rounded-xl text-xs sm:text-sm"
                            >
                                <MessageSquare className="size-4 text-emerald-500" />
                                <span>AI Chat & RAG</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="artifacts"
                                className="gap-2 rounded-xl text-xs sm:text-sm"
                            >
                                <Sparkles className="size-4 text-amber-500" />
                                <span>Study Artifacts</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Sources Tab */}
                    <TabsContent value="sources" className="flex-1">
                        <div className="p-8 text-center rounded-3xl border border-dashed border-border/80 bg-card/30 backdrop-blur-sm space-y-3">
                            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                                <FileText className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">
                                    Knowledge Sources
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                    Upload PDFs, paste Website URLs, or add YouTube links.
                                    Sources are chunked and vectorized with Mistral into Pinecone.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Chat Tab */}
                    <TabsContent value="chat" className="flex-1">
                        <div className="p-8 text-center rounded-3xl border border-dashed border-border/80 bg-card/30 backdrop-blur-sm space-y-3">
                            <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                                <MessageSquare className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">
                                    RAG Chat Assistant
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                    Chat with your workspace materials. Powered by Mistral AI,
                                    Pinecone vector retrieval, and Tavily web search.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Artifacts Tab */}
                    <TabsContent value="artifacts" className="flex-1">
                        <div className="p-8 text-center rounded-3xl border border-dashed border-border/80 bg-card/30 backdrop-blur-sm space-y-3">
                            <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
                                <Sparkles className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">
                                    Learning Artifacts & Study Tools
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                    Generate flashcards, interactive quizzes, mind maps, key
                                    takeaways, and comprehensive study reports from your sources.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            <EditWorkspaceDialog
                workspace={workspace}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </div>
    );
}
