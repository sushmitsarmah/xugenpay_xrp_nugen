// src/utils/nugenApi.ts
import {
    NUGEN_API_KEY,
    LLM_API_URL,
    NUGEN_MODEL_LLM,
    NUGEN_MODEL_EMBED
} from './config';
import fetch from 'node-fetch';

/**
 * Sends a chat completion request to the Nugen LLM API.
 * @param messages The conversation history and current user message.
 * @param model The Nugen LLM model to use (e.g., "nugen-flash-instruct").
 * @param temperature Controls randomness (0.0-1.0), lower for more deterministic.
 * @param max_tokens The maximum number of tokens to generate in the response.
 * @returns A promise that resolves to the generated text content.
 * @throws Error if the API call fails or response is malformed.
 */
export async function getNugenChatCompletion(
    messages: Array<{ role: string; content: string }>,
    model: string = NUGEN_MODEL_LLM,
    temperature: number = 0.1,
    max_tokens: number = 300
): Promise<string> {
    const url = `${LLM_API_URL}/chat/completions`;
    const headers = {
        "Authorization": `Bearer ${NUGEN_API_KEY}`,
        "Content-Type": "application/json"
    };
    const body = JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: max_tokens,
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Nugen Chat Completion API error: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json() as any;
        const content = jsonResponse.choices[0]?.message?.content?.trim();

        if (!content) {
            throw new Error("Nugen Chat Completion response content is empty or malformed.");
        }
        return content;
    } catch (error) {
        console.error('Error in getNugenChatCompletion:', error);
        throw error;
    }
}

// If you ever need embeddings from Nugen, you'd add a similar function here:
export async function getNugenEmbedding(text: string, model: string = NUGEN_MODEL_EMBED): Promise<number[] | null> {
    const url = `${LLM_API_URL}/embeddings`;
    const headers = {
        "Authorization": `Bearer ${NUGEN_API_KEY}`,
        "Content-Type": "application/json"
    };
    const data = {
        "model": model,
        "input": text
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const jsonResponse = await response.json() as any;
            const embedding = jsonResponse.data[0]?.embedding;
            if (embedding) {
                return embedding;
            }
        }
        console.error(`Error generating embedding from Nugen API: ${response.status}, ${await response.text()}`);
        return null;
    } catch (error) {
        console.error(`Network error or Nugen API issue during embedding generation:`, error);
        return null;
    }
}