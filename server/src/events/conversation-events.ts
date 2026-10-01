import { inngest } from "../inngest/client.js";

/**
 * Enqueues a conversation summarization job to run asynchronously via Inngest.
 */
export async function enqueueConversationSummarize(input: {
    conversationId: string;
    userId: string;
}) {
    await inngest.send({
        name: "conversation/summarize",
        data: input,
    });
}
