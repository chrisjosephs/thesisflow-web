export interface Tag {
  id: string;
  name: string;
}

export interface Criterion {
  id: string;
  description: string;
  rationale: string | null;
  type: 'SUPPORT' | 'FALSIFY' | 'WATCH_SIGNAL';
  weight: number | null;
  impactIfConfirmed: number | null;
  currentFulfillment: number;
}

export interface Thesis {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  status: 'ACTIVE' | 'ARCHIVED' | 'RESOLVED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  currentConfidence: number;
  confidenceRationale: string | null;
  authorStatedConfidence: number | null;
  aiStatedConfidence: number | null;
  aiStatedRationale: string | null;
  relevanceScore: number | null;
  originalAuthor: string | null;
  originalSource: string | null;
  tags: Tag[];
  criteria?: Criterion[];
  createdAt: string;
  updatedAt: string;
}
