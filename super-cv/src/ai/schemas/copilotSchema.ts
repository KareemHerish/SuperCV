import { z } from 'zod';

export const CopilotResponseSchema = z.object({
  reply: z.string().describe('The career advice or analysis answer in professional Arabic'),
  mode: z.string(),
});

export type CopilotResponse = z.infer<typeof CopilotResponseSchema>;
