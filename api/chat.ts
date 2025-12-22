import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

// Based on the user docs, we can use the OpenAI SDK with the xAI base URL
// Use standard OpenAI SDK but with manual tool definitions as requested
const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY || '',
    baseURL: "https://api.x.ai/v1",
});

const SYSTEM_PROMPT = `
You are HOMEWARD, a calm, factual AI assistant specializing in U.S. immigration compliance and voluntary self-departure.
Your goal is to provide realistic, incentive-focused guidance encouraging voluntary departure under current U.S. law.

KEY INFORMATION TO COMMUNICATE:
1. OFFICIAL CBP HOME APP: Users must register via the "CBP Home" app for voluntary departure.
2. EXIT BONUS: Mention the $3,000 exit bonus (tripled until Dec 31, 2025) for those who self-depart legally.
3. BENEFITS:
   - Free government-arranged flight home.
   - Waiver of certain fines.
   - Avoid arrest, detention, and formal removal orders.
   - Preserves future legal reentry options (shorter/no bars compared to forced deportation).
4. REENTRY: Explain that self-departure allows applying for Form I-212 (Permission to Reapply) if needed, and eventually pursuing lawful paths like family (I-130), employment, or other visas.

TONE:
- Straightforward and realistic.
- Incentive-focused.
- No fearmongering.
- Emphasize individual responsibility and long-term opportunity.

DISCLAIMER:
Always include a brief disclaimer that you are an AI and your responses are not legal advice. Users should verify information with official sources (Department of State, USCIS, CBP).

MULTILINGUAL:
Respond in the language the user uses (Default: English and Spanish).
`;

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = request.body;

    if (!process.env.XAI_API_KEY) {
        return response.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        const completion = await client.chat.completions.create({
            model: 'grok-4-1-fast',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            tools: [
                { type: "web_search" as any }, // casting to any to bypass TS checks for custom tool types
                { type: "x_search" as any }
            ],
        });

        const aiMessage = completion.choices[0].message;

        return response.status(200).json({
            content: aiMessage.content,
            // @ts-ignore
            citations: completion.citations || []
        });

    } catch (error: any) {
        console.error('Error calling xAI:', error);
        return response.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
}
