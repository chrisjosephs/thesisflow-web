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

export interface CommunityConfidence {
  average: number | null;
  count: number;
  maybeStale: boolean;
}

export interface Thesis {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'RESOLVED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  currentConfidence: number;
  confidenceRationale: string | null;
  authorStatedConfidence: number | null;
  aiStatedConfidence: number | null;
  aiStatedRationale: string | null;
  relevanceScore: number | null;
  originalAuthor: string | null;
  originalSource: string | null;
  community: CommunityConfidence;
  tags: Tag[];
  criteria?: Criterion[];
  expiresAt: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
}
