"use client";

import { WorkspaceHeader } from "@/components/workspaces/workspace-header";
import { WorkspaceGrid } from "@/components/workspaces/workspace-grid";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    FileText,
    Bot,
    GraduationCap,
    ArrowRight,
    Video,
    Globe,
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex flex-col">
            <WorkspaceHeader />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
                {/* Hero section */}
                <section className="relative rounded-[32px] overflow-hidden border border-border/60 bg-gradient-to-br from-card/80 via-card/40 to-background/60 p-8 sm:p-12 shadow-2xl shadow-primary/5 backdrop-blur-xl">
                    {/* Ambient glow backgrounds */}
                    <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                            <Sparkles className="size-3.5" />
                            <span>Powered by Mistral AI & Pinecone RAG</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
                            Personalized AI notebooks for{" "}
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-amber-500 bg-clip-text text-transparent">
                                your knowledge
                            </span>
                        </h1>

                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
                            Upload PDFs, scrape web articles, and import YouTube
                            transcripts. ChaiBook indexes your sources so you can chat with
                            grounded context, generate instant quizzes, flashcards, and study
                            summaries.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <CreateWorkspaceDialog
                                trigger={
                                    <Button
                                        size="lg"
                                        className="h-11 px-6 rounded-2xl gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all font-semibold"
                                    >
                                        <Sparkles className="size-4" />
                                        <span>Create New Notebook</span>
                                        <ArrowRight className="size-4 ml-1" />
                                    </Button>
                                }
                            />

                            <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-2 rounded-2xl bg-muted/40 border border-border/40">
                                <FileText className="size-3.5 text-rose-500" />
                                <span>PDF</span>
                                <span>•</span>
                                <Globe className="size-3.5 text-blue-500" />
                                <span>Web</span>
                                <span>•</span>
                                <Video className="size-3.5 text-red-500" />
                                <span>YouTube</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workspaces Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold font-heading tracking-tight">
                                Your Notebooks
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Select a workspace to explore sources, chat, and study tools
                            </p>
                        </div>
                    </div>

                    <WorkspaceGrid />
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
                <p>ChaiBook NotebookLM — AI-Powered Learning Assistant</p>
            </footer>
        </div>
    );
}
