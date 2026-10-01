import { inngest } from "../inngest/client.js";


export async function enqueueConversationSummarize(input: {
    conversationId: string;
    userId: string;
}) {
    await inngest.send({
        name: "conversation/summarize", //worker function name
        data: input,
    });
}