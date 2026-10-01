export const API_BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (!res.ok) {
        let errorData: any = {};
        try {
            errorData = await res.json();
        } catch {
            errorData = { message: res.statusText };
        }

        throw new ApiError(
            res.status,
            errorData.message || `Request failed with status ${res.status}`,
            errorData.errors || errorData,
        );
    }

    if (res.status === 204) {
        return {} as T;
    }

    return res.json();
}

export type Workspace = {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    icon?: string | null;
    defaultModel: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        sources?: number;
        conversations?: number;
        artifacts?: number;
    };
};

export type CreateWorkspacePayload = {
    title: string;
    description?: string;
    icon?: string;
    defaultModel?: string;
};

export type UpdateWorkspacePayload = Partial<CreateWorkspacePayload>;

export const workspaceApi = {
    list: () => fetchApi<Workspace[]>("/api/workspaces"),
    get: (workspaceId: string) =>
        fetchApi<Workspace>(`/api/workspaces/${workspaceId}`),
    create: (data: CreateWorkspacePayload) =>
        fetchApi<Workspace>("/api/workspaces", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    update: (workspaceId: string, data: UpdateWorkspacePayload) =>
        fetchApi<Workspace>(`/api/workspaces/${workspaceId}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
    delete: (workspaceId: string) =>
        fetchApi<void>(`/api/workspaces/${workspaceId}`, {
            method: "DELETE",
        }),
};
