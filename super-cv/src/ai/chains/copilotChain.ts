import { HfInference } from "@huggingface/inference";
import { getCopilotPrompt } from "../prompts/copilotPrompt";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MISTRAL_MODEL = "HuggingFaceH4/zephyr-7b-beta";

export async function runCopilotChain(context: string, message: string): Promise<string> {
  const prompt = getCopilotPrompt(context, message);
  
  try {
    console.log('[RAG] Attempting generation...');
    const response = await hf.chatCompletion({
      model: MISTRAL_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    
    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('[RAG] Generation failed:', error);
    throw error;
  }
}
