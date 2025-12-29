import { WeakSignal, SearchParams } from '../types';

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const testApiKey = async (apiKey: string): Promise<void> => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'user',
            content: 'Test',
          },
        ],
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        throw new Error('Invalid API key');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error - check your connection');
  }
};

export const searchWithPerplexity = async (
  params: SearchParams,
  apiKey: string,
  systemPrompt: string,
  pestelPrompt: string,
  signalDefinition: string,
  sourceDiversity: string,
  metricsMethodology: string
): Promise<WeakSignal[]> => {
  const { domain, geography, timeline, detailedContext, uploadedDocuments } = params;

  let contextSection = '';
  if (detailedContext) {
    contextSection += `\n\nSPECIFIC CONTEXT:\n${detailedContext}`;
  }

  if (uploadedDocuments && uploadedDocuments.length > 0) {
    contextSection += `\n\nCONTEXT DOCUMENTS: User has provided ${uploadedDocuments.length} document(s) as ground truth for analysis: ${uploadedDocuments.map(d => d.name).join(', ')}`;
  }

  const userPrompt = `Search for weak signals relevant to:
DOMAIN: ${domain}
GEOGRAPHY: ${geography}
TIMELINE: ${timeline}
${contextSection}

${pestelPrompt}

${signalDefinition}

${sourceDiversity}

${metricsMethodology}

CRITICAL SOURCE REQUIREMENTS - READ CAREFULLY:
- Each signal must cite EXACTLY ONE source
- The "source" field must contain ONLY ONE publication name
- DO NOT include commas, semicolons, or "and" to combine sources
- DO NOT write "OECD, Deloitte" - choose ONE: either "OECD" OR "Deloitte"
- DO NOT write "Nature, Science" - choose ONE: either "Nature" OR "Science"
- Example CORRECT: "source": "McKinsey Global Institute Report 2025"
- Example INCORRECT: "source": "McKinsey, BCG" ← NEVER DO THIS
- Example INCORRECT: "source": "OECD; World Bank" ← NEVER DO THIS

Return exactly 20 weak signals in valid JSON array format. Each signal must have this exact structure:
{
  "title": "string",
  "description": "string",
  "driverCategory": "Political|Economic|Social|Technological|Environmental|Legal",
  "evidence": "string",
  "caseStudy": "string",
  "relevanceNote": "string",
  "source": "string (EXACTLY ONE SOURCE NAME ONLY - no commas, semicolons, or combining)",
  "sourceUrl": "string (full URL to the ONE source)",
  "impact": number (1-10),
  "uncertainty": number (1-10),
  "probability": number (1-10),
  "impactRationale": "string (1-2 sentence explanation)",
  "uncertaintyRationale": "string (1-2 sentence explanation)",
  "probabilityRationale": "string (1-2 sentence explanation)"
}`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: PerplexityResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }

    const signals = JSON.parse(jsonMatch[0]);

    return signals.map((signal: Omit<WeakSignal, 'id'>, idx: number) => {
      let cleanedSource = signal.source;

      // If source contains comma or semicolon, take only the first part
      if (cleanedSource.includes(',')) {
        cleanedSource = cleanedSource.split(',')[0].trim();
      }
      if (cleanedSource.includes(';')) {
        cleanedSource = cleanedSource.split(';')[0].trim();
      }

      // If sources array exists and has multiple items, keep only the first one
      let cleanedSources = signal.sources;
      if (cleanedSources && cleanedSources.length > 1) {
        cleanedSources = [cleanedSources[0]];
      }

      return {
        ...signal,
        source: cleanedSource,
        sources: cleanedSources,
        id: `signal-${Date.now()}-${idx}`,
      };
    });
  } catch (error) {
    console.error('Perplexity API error:', error);
    throw error;
  }
};
