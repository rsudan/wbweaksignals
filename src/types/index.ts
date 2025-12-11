export type PestelCategory = 'Political' | 'Economic' | 'Social' | 'Technological' | 'Environmental' | 'Legal';

export interface SourceCitation {
  text: string;
  url: string;
}

export interface WeakSignal {
  id: string;
  title: string;
  description: string;
  driverCategory: PestelCategory;
  evidence: string;
  caseStudy: string;
  relevanceNote: string;
  source: string;
  sourceUrl?: string;
  sources?: SourceCitation[];
  impact: number;
  uncertainty: number;
  probability: number;
  impactRationale?: string;
  uncertaintyRationale?: string;
  probabilityRationale?: string;
}

export interface SearchParams {
  domain: string;
  geography: string;
  timeline: string;
  detailedContext?: string;
  uploadedDocuments?: File[];
}

export interface SettingsState {
  apiKey: string;
  systemPrompt: string;
  pestelPrompt: string;
  signalDefinition: string;
  sourceDiversity: string;
  metricsMethodology: string;
}

export interface Scan {
  id: string;
  title: string;
  domain: string;
  geography: string;
  timeline: string;
  detailed_context?: string;
  signals: WeakSignal[];
  created_at: string;
  updated_at: string;
}
