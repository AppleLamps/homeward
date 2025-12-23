
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
}

export interface Citation {
  url: string;
  title: string;
}

export interface GrokResponse {
  content: string;
  citations: Citation[];
}

// Remove inline citation markers like [[1]](url) from text
function stripInlineCitations(text: string): string {
  // Remove patterns like [[1]](https://...) or [[2]](url)
  return text.replace(/\[\[\d+\]\]\([^)]+\)/g, '').replace(/\s{2,}/g, ' ').trim();
}

export async function getGrokResponse(messages: Message[]): Promise<GrokResponse> {
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
      if (response.status === 404) {
        throw new Error("API endpoint not found. Please ensure you are running the app using 'vercel dev' to enable serverless functions.");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();

    // Strip inline citations from content
    const cleanContent = stripInlineCitations(data.content || '');

    // Deduplicate citations by URL
    const uniqueCitations: Citation[] = [];
    const seenUrls = new Set<string>();
    for (const citation of (data.citations || [])) {
      if (!seenUrls.has(citation.url)) {
        seenUrls.add(citation.url);
        uniqueCitations.push(citation);
      }
    }

    return {
      content: cleanContent,
      citations: uniqueCitations
    };
  } catch (error) {
    console.error("API Call failed:", error);
    throw error;
  }
}
