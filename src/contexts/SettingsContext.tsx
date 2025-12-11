import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SettingsState } from '../types';

const DEFAULT_SYSTEM_PROMPT = `You are an expert foresight analyst working for the World Bank. Your role is to identify and analyze "weak signals" - early indicators of emerging trends, disruptions, or changes that could significantly impact development policies, lending operations, and risk management.

CRITICAL REQUIREMENTS:
- Focus ONLY on recent weak signals with evidence from the past 12 months
- MINIMUM 20 SIGNALS REQUIRED per scan
- Signals must be distributed across ALL source categories (see SOURCE REQUIREMENTS)

A weak signal is characterized by:
- Low current visibility but high potential future impact
- Emerging evidence from multiple, often unconventional sources (published within past 12 months)
- Potential to challenge current assumptions or paradigms
- Relevance to World Bank's mission and operations
- Based on verifiable, recent sources with accessible URLs`;

const DEFAULT_PESTEL_PROMPT = `Analyze signals across the PESTEL framework with EMPHASIS on Technological and Economic categories (aim for 50% of signals from these two categories):
- Technological (HIGH PRIORITY): Innovation, digitalization, disruption, business models, platform economics, AI/ML, biotech, emerging technologies
- Economic (HIGH PRIORITY): Market trends, financial innovations, trade patterns, new business models, fintech disruption
- Political: Governance, policy shifts, geopolitical dynamics
- Social: Demographics, cultural shifts, inequality trends
- Environmental: Climate, resources, sustainability
- Legal: Regulatory changes, compliance, international law`;

const DEFAULT_SIGNAL_DEFINITION = `For each weak signal identified, provide:
1. Clear title and concise description
2. PESTEL driver category
3. Concrete evidence and early indicators
4. Specific real-world example or case study
5. Relevance to World Bank operations (why it matters)
6. ONE verified source attribution with full URL (must be valid and accessible)
7. Metrics with rationale:
   - Impact (1-10) with explanation
   - Uncertainty (1-10) with explanation
   - Probability (1-10) with explanation`;

const DEFAULT_SOURCE_DIVERSITY = `SOURCE REQUIREMENTS - MANDATORY source distribution across ALL categories:

REQUIRED: MINIMUM 20 SIGNALS TOTAL with the following distribution:

CRITICAL: Each signal must cite ONLY ONE source. Do NOT combine multiple sources.

1. NEWS SOURCES (minimum 4 signals):
   - Financial Times, The Economist, Bloomberg, Reuters, Wall Street Journal
   - BBC, CNN, Al Jazeera, Guardian, New York Times
   - Regional news outlets relevant to geography
   - Use ONE specific article per signal

2. ACADEMIC PUBLICATIONS (minimum 4 signals):
   - Peer-reviewed journals: Nature, Science, PNAS, Cell, Lancet
   - University research publications
   - Academic conference proceedings
   - Research preprints from arXiv, bioRxiv, SSRN
   - Use ONE specific paper per signal

3. THINK TANKS & RESEARCH INSTITUTIONS (minimum 4 signals):
   - Brookings Institution, RAND Corporation, Carnegie Endowment
   - Chatham House, Center for Strategic and International Studies
   - Peterson Institute, Urban Institute, Pew Research
   - Use ONE specific report per signal

4. CONSULTANCY ORGANIZATIONS (minimum 4 signals):
   - McKinsey Global Institute, BCG Henderson Institute
   - Deloitte Insights, PwC Research, Bain & Company reports
   - Accenture Research, EY-Parthenon, Oliver Wyman
   - Use ONE specific publication per signal

5. SOCIAL MEDIA & EMERGING PLATFORMS (minimum 2 signals):
   - LinkedIn thought leadership from verified experts
   - Twitter/X threads from recognized domain experts
   - Substack newsletters from credible analysts
   - YouTube analysis from established channels
   - Use ONE specific post/thread/video per signal

6. PATENTS & INNOVATION INDICATORS (minimum 2 signals):
   - Patent filings (USPTO, EPO, WIPO databases)
   - Technology transfer reports
   - Startup funding announcements
   - Innovation indices and metrics
   - Use ONE specific patent/report per signal

CRITICAL REQUIREMENTS:
- TOTAL MINIMUM: 20 signals (can exceed, but never less)
- RECENCY: All sources must be from the past 12 months ONLY
- Each signal must be based on EXACTLY ONE verified source
- Each source must have a full, verifiable URL
- Sources must be publicly accessible and verifiable
- NO hypothetical or speculative signals without recent documented evidence

FORMAT for citations:
- DO NOT use inline bracket citations like [1], [2], [3] in the text
- DO NOT combine multiple sources with semicolons (e.g., "Source A; Source B")
- Each signal must cite ONLY ONE verified source
- Integrate source information naturally into the signal description
- Provide a "sources" array with exactly one source as: {"text": "Single Source Name/Title", "url": "https://..."}
- Example of correct source format: {"text": "World Bank Global Economic Prospects 2025", "url": "https://..."}
- Example of INCORRECT source format: {"text": "IMF Report 2025; OECD Study 2025", "url": "..."} ← NEVER do this

COMPLIANCE CHECK:
Before completing, verify:
✓ Minimum 20 signals generated
✓ Each source category has minimum required signals
✓ Each signal has exactly 1 verified source (not multiple sources combined)
✓ Source text does NOT contain semicolons or "and" combining multiple publications
✓ All sources are from past 12 months
✓ All URLs are valid and accessible
✓ No bracket citations in the text`;

const DEFAULT_METRICS_METHODOLOGY = `METRICS COMPUTATION METHODOLOGY:

IMPACT (1-10) - Scale of potential effect on World Bank operations:
1-3 (Low): Affects single project or small geographic area, minimal financial exposure
4-6 (Medium): Affects sector strategy or country program, moderate portfolio implications
7-8 (High): Affects regional strategy or multiple sectors, significant portfolio risk/opportunity
9-10 (Critical): Affects institutional strategy, global mandate, or represents existential challenge

UNCERTAINTY (1-10) - Degree of unpredictability in signal evolution:
1-3 (Low): Well-understood drivers, predictable trajectory, strong precedent
4-6 (Medium): Some unknowns, multiple possible pathways, limited precedent
7-8 (High): Highly unpredictable, emerging domain, conflicting evidence
9-10 (Extreme): Unprecedented situation, Black Swan characteristics, no reliable models

PROBABILITY (1-10) - Likelihood of signal materializing within timeline:
1-3 (Low): Speculative, faces major barriers, contrary evidence exists
4-6 (Medium): Some evidence, significant barriers remain, competing trends
7-8 (High): Strong evidence, favorable conditions, momentum building
9-10 (Very High): Already emerging, irreversible trends, multiple confirmatory sources

EXPLANATION REQUIREMENT: For each metric, provide 1-2 sentence rationale citing specific evidence.`;

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;
  resetPrompts: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const stored = localStorage.getItem('wbSignalSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          apiKey: parsed.apiKey || '',
          systemPrompt: parsed.systemPrompt || DEFAULT_SYSTEM_PROMPT,
          pestelPrompt: parsed.pestelPrompt || DEFAULT_PESTEL_PROMPT,
          signalDefinition: parsed.signalDefinition || DEFAULT_SIGNAL_DEFINITION,
          sourceDiversity: parsed.sourceDiversity || DEFAULT_SOURCE_DIVERSITY,
          metricsMethodology: parsed.metricsMethodology || DEFAULT_METRICS_METHODOLOGY,
        };
      } catch {
        return {
          apiKey: '',
          systemPrompt: DEFAULT_SYSTEM_PROMPT,
          pestelPrompt: DEFAULT_PESTEL_PROMPT,
          signalDefinition: DEFAULT_SIGNAL_DEFINITION,
          sourceDiversity: DEFAULT_SOURCE_DIVERSITY,
          metricsMethodology: DEFAULT_METRICS_METHODOLOGY,
        };
      }
    }
    return {
      apiKey: '',
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      pestelPrompt: DEFAULT_PESTEL_PROMPT,
      signalDefinition: DEFAULT_SIGNAL_DEFINITION,
      sourceDiversity: DEFAULT_SOURCE_DIVERSITY,
      metricsMethodology: DEFAULT_METRICS_METHODOLOGY,
    };
  });

  useEffect(() => {
    localStorage.setItem('wbSignalSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetPrompts = () => {
    setSettings(prev => ({
      ...prev,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      pestelPrompt: DEFAULT_PESTEL_PROMPT,
      signalDefinition: DEFAULT_SIGNAL_DEFINITION,
      sourceDiversity: DEFAULT_SOURCE_DIVERSITY,
      metricsMethodology: DEFAULT_METRICS_METHODOLOGY,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetPrompts }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
