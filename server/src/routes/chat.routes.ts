import { Router } from "express";
import {
    chat,
    createConversation,
    deleteConversation,
    getConversationMessages,
    listConversations,
} from "../controllers/chat.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const chatRoutes = Router({ mergeParams: true });

// Streaming chat endpoint: POST /api/workspaces/:workspaceId/chat
chatRoutes.post("/", asyncHandler(chat));

// Conversation endpoints: /api/workspaces/:workspaceId/chat/conversations...
chatRoutes.get("/conversations", asyncHandler(listConversations));
chatRoutes.post("/conversations", asyncHandler(createConversation));
chatRoutes.get(
    "/conversations/:conversationId/messages",
    asyncHandler(getConversationMessages),
);
chatRoutes.delete(
    "/conversations/:conversationId",
    asyncHandler(deleteConversation),
);
