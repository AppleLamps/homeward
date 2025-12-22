
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}


export async function getGrokResponse(messages: Message[]) {
  // If we have a server-side endpoint (which acts as the proxy), we use it.
  // The apiKey param here is kept for compatibility but might be ignored if using server env.

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("API Call failed:", error);
    throw error;
  }
}
