import type { Thesis } from './types';

const ENGINE = process.env.NEXT_PUBLIC_ENGINE_URL ?? 'http://localhost:3001/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${ENGINE}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Engine error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const getTheses  = ()          => get<Thesis[]>(`/theses`);
export const getThesis  = (id: string) => get<Thesis>(`/theses/${id}`);
