import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    CreateWorkspacePayload,
    UpdateWorkspacePayload,
    workspaceApi,
} from "@/lib/api";

export const WORKSPACE_KEYS = {
    all: ["workspaces"] as const,
    detail: (id: string) => ["workspaces", id] as const,
};

export function useWorkspaces() {
    return useQuery({
        queryKey: WORKSPACE_KEYS.all,
        queryFn: () => workspaceApi.list(),
    });
}

export function useWorkspace(workspaceId: string) {
    return useQuery({
        queryKey: WORKSPACE_KEYS.detail(workspaceId),
        queryFn: () => workspaceApi.get(workspaceId),
        enabled: Boolean(workspaceId),
    });
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateWorkspacePayload) => workspaceApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
        },
    });
}

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            workspaceId,
            data,
        }: {
            workspaceId: string;
            data: UpdateWorkspacePayload;
        }) => workspaceApi.update(workspaceId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
            queryClient.invalidateQueries({
                queryKey: WORKSPACE_KEYS.detail(variables.workspaceId),
            });
        },
    });
}

export function useDeleteWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workspaceId: string) =>
            workspaceApi.delete(workspaceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
        },
    });
}
