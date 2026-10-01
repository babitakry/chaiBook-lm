import { mistral } from "@ai-sdk/mistral";
import { embedMany } from "ai";
import { EMBEDDING_MODEL } from "./ai-config.js";

export async function embedTexts(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
        return [];
    }

    if (!process.env.MISTRAL_API_KEY) {
        throw new Error("MISTRAL_API_KEY is not configured");
    }

    const { embeddings } = await embedMany({
        model: mistral.textEmbeddingModel(EMBEDDING_MODEL),
        values: texts,
    });

    return embeddings;
}