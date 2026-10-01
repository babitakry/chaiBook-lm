"use client";

import { useState } from "react";
import { useCreateWorkspace } from "@/hooks/use-workspaces";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles, Loader2 } from "lucide-react";

const ICON_PRESETS = ["📚", "💡", "🔬", "🚀", "💻", "🧠", "🎨", "📊", "⚡", "📖", "🌐", "📝"];

const MODEL_OPTIONS = [
    { value: "mistral-small-latest", label: "Mistral Small (Fast & Free Tier)" },
    { value: "mistral-large-latest", label: "Mistral Large (Reasoning & Deep Analysis)" },
    { value: "open-mistral-nemo", label: "Mistral Nemo (Multilingual)" },
];

export function CreateWorkspaceDialog({
    trigger,
}: {
    trigger?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("📚");
    const [defaultModel, setDefaultModel] = useState("mistral-small-latest");
    const [error, setError] = useState<string | null>(null);

    const createWorkspace = useCreateWorkspace();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Workspace title is required.");
            return;
        }

        try {
            await createWorkspace.mutateAsync({
                title: title.trim(),
                description: description.trim() || undefined,
                icon,
                defaultModel,
            });
            setTitle("");
            setDescription("");
            setIcon("📚");
            setOpen(false);
        } catch (err: any) {
            setError(err?.message || "Failed to create workspace. Make sure you are logged in.");
        }
    };

    return (
        <>
            {trigger ? (
                <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <Button
                    onClick={() => setOpen(true)}
                    className="gap-2 shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Plus className="size-4" />
                    <span>New Workspace</span>
                </Button>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <Sparkles className="size-5 text-primary" />
                                Create New Workspace
                            </DialogTitle>
                            <DialogDescription>
                                Create a study or research workspace to ingest PDFs, links, YouTube videos, and chat with AI.
                            </DialogDescription>
                        </DialogHeader>

                        {error && (
                            <div className="p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* Icon Picker */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                    Workspace Icon
                                </label>
                                <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-muted/30 border border-border/50">
                                    {ICON_PRESETS.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setIcon(preset)}
                                            className={`size-9 rounded-xl flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-95 ${
                                                icon === preset
                                                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                                                    : "hover:bg-muted"
                                            }`}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                    Title *
                                </label>
                                <Input
                                    placeholder="e.g. Operating Systems, ML Research..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                    Description (optional)
                                </label>
                                <Input
                                    placeholder="Brief overview of what this notebook covers"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Default Model */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                    AI Model
                                </label>
                                <select
                                    value={defaultModel}
                                    onChange={(e) => setDefaultModel(e.target.value)}
                                    className="w-full h-9 rounded-2xl border border-input/60 bg-input/40 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    {MODEL_OPTIONS.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="pt-2 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                disabled={createWorkspace.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createWorkspace.isPending || !title.trim()}
                                className="min-w-24 gap-1.5"
                            >
                                {createWorkspace.isPending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <span>Create Workspace</span>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
