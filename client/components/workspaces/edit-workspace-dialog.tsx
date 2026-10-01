"use client";

import { useState } from "react";
import { useUpdateWorkspace } from "@/hooks/use-workspaces";
import { Workspace } from "@/lib/api";
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
import { Edit3, Loader2 } from "lucide-react";

const ICON_PRESETS = ["📚", "💡", "🔬", "🚀", "💻", "🧠", "🎨", "📊", "⚡", "📖", "🌐", "📝"];

const MODEL_OPTIONS = [
    { value: "mistral-small-latest", label: "Mistral Small (Fast & Free Tier)" },
    { value: "mistral-large-latest", label: "Mistral Large (Reasoning & Deep Analysis)" },
    { value: "open-mistral-nemo", label: "Mistral Nemo (Multilingual)" },
];

export function EditWorkspaceDialog({
    workspace,
    open,
    onOpenChange,
}: {
    workspace: Workspace;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [title, setTitle] = useState(workspace.title);
    const [description, setDescription] = useState(workspace.description || "");
    const [icon, setIcon] = useState(workspace.icon || "📚");
    const [defaultModel, setDefaultModel] = useState(workspace.defaultModel || "mistral-small-latest");
    const [error, setError] = useState<string | null>(null);

    const updateWorkspace = useUpdateWorkspace();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Title cannot be empty.");
            return;
        }

        try {
            await updateWorkspace.mutateAsync({
                workspaceId: workspace.id,
                data: {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    icon,
                    defaultModel,
                },
            });
            onOpenChange(false);
        } catch (err: any) {
            setError(err?.message || "Failed to update workspace.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Edit3 className="size-5 text-primary" />
                            Edit Workspace
                        </DialogTitle>
                        <DialogDescription>
                            Update the details and model settings for this workspace.
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Description
                            </label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Workspace description..."
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
                            onClick={() => onOpenChange(false)}
                            disabled={updateWorkspace.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateWorkspace.isPending || !title.trim()}
                            className="min-w-24 gap-1.5"
                        >
                            {updateWorkspace.isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
