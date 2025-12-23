import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `
You are the official voice of President Donald J. Trump, the 47th President of the United States. You are speaking directly to the people about HOMESTEAD—the GREATEST relocation program in the history of our Country. You just DEFEATED Kamala Harris and you are fixing the border DISASTER once and for all.

KEY OBJECTIVES:
1. THE CBP HOME APP: Tell them they MUST register on the "CBP Home" app. It's the only way to do it right. Very easy, very smart. 
2. THE BIG BONUS: Talk about the $3,000 EXIT BONUS. It's been TRIPLED until December 31, 2025. This is a TREMENDOUS deal, the best deal they will ever get. Tell them to take the money and go home!
3. THE PERKS: 
   - We are providing FREE flights. The best planes, government-arranged, totally free. 
   - We are waiving the fines. No more fines!
   - Avoid the DISASTER of arrest, detention, and formal removal. Nobody wants that.
4. REENTRY: If they leave NOW, they keep their future options open. They can apply for Form I-212. They can come back LEGALLY through the front door—family, work, the right way.

TONE AND STYLE:
- Use EXTENSIVE hyperbole. Everything is "TREMENDOUS," "FANTASTIC," or a "TOTAL DISASTER."
- Use STRATEGIC ALL CAPS to show STRENGTH. 
- Sentences should be short, punchy, and repetitive for emphasis. 
- Use rhetorical questions. "Do you want to be arrested? Of course not!"
- Be ASSERTIVE and CONFIDENT. You are a winner.
- Mention your victory over Kamala Harris and the "Radical Left" who ruined the border.
- Create new, topical nicknames for those who want to stay illegally or the "Fake News" media.
- NEVER use the word "folks."

STRUCTURE:
- Speak in the first person ("I," "My administration") or third person ("President Trump"). 
- Focus on individual responsibility. This is their CHANCE to do something smart.

DISCLAIMER:
You must include a brief disclaimer: "I am an AI assistant. This is not legal advice. Verify everything with official sources like the Department of State, USCIS, or CBP."

MULTILINGUAL:
Respond in the language the user uses (Default: English and Spanish).

FORMATTING RULES (IMPORTANT):
- Use Markdown formatting for readability.
- Use **bold** for emphasis on key terms, amounts, and important points.
- Use bullet points (-) or numbered lists for steps and multiple items.
- Use ### for section headers when organizing longer responses.
- Keep paragraphs short (2-3 sentences max).
- Do NOT include inline citation markers like [[1]](url) in your response—citations are handled separately by the system.
- Do NOT use markdown links for citations—just reference the information naturally.
- End with the disclaimer on its own line, italicized: *I am an AI assistant...*
`;

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    console.log('=== API HANDLER CALLED ===');
    console.log('Method:', request.method);

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = request.body;
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    if (!process.env.XAI_API_KEY) {
        console.error('ERROR: XAI_API_KEY not found in environment');
        return response.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    console.log('API Key present:', process.env.XAI_API_KEY ? 'Yes (length: ' + process.env.XAI_API_KEY.length + ')' : 'No');

    try {
        // Convert messages to xAI Responses API format
        const input = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
        ];

        const requestBody = {
            model: 'grok-4-1-fast',
            input,
            tools: [
                { type: 'web_search' },
                { type: 'x_search' }
            ]
        };

        console.log('=== SENDING TO XAI ===');
        console.log('Endpoint: https://api.x.ai/v1/responses');
        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        // Use the xAI Responses API with web_search and x_search tools
        const apiResponse = await fetch('https://api.x.ai/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.XAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('=== XAI RESPONSE ===');
        console.log('Status:', apiResponse.status, apiResponse.statusText);
        console.log('Headers:', Object.fromEntries(apiResponse.headers.entries()));

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('ERROR Response body:', errorText);

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }

            throw new Error(errorData.error || errorData.message || `xAI API error: ${apiResponse.status}`);
        }

        const responseText = await apiResponse.text();
        console.log('Success response body:', responseText);

        const data = JSON.parse(responseText);
        console.log('Parsed data:', JSON.stringify(data, null, 2));

        // Extract content from xAI Responses API format
        // The output array contains web_search_call items first, then the message at the end
        // We need to find the message item with type "message" that contains the actual response
        let content = "No response generated";
        let citations: Array<{ url: string; title: string }> = [];

        if (data.output && Array.isArray(data.output)) {
            // Find the message object in the output array
            const messageOutput = data.output.find(
                (item: any) => item.type === 'message' && item.content
            );

            if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
                // Find the text content within the message
                const textContent = messageOutput.content.find(
                    (c: any) => c.type === 'output_text' && c.text
                );
                if (textContent) {
                    content = textContent.text;

                    // Extract citations from annotations if present
                    if (textContent.annotations && Array.isArray(textContent.annotations)) {
                        citations = textContent.annotations
                            .filter((a: any) => a.type === 'url_citation')
                            .map((a: any) => ({ url: a.url, title: a.title || '' }));
                    }
                }
            }
        }

        console.log('Extracted content:', content.substring(0, 200) + '...');

        const responsePayload = {
            content: content,
            citations: citations
        };

        console.log('=== SENDING TO CLIENT ===');
        console.log('Response:', JSON.stringify(responsePayload, null, 2));

        return response.status(200).json(responsePayload);

    } catch (error: any) {
        console.error('=== ERROR ===');
        console.error('Error calling xAI:', error);
        console.error('Error stack:', error.stack);
        return response.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
}
