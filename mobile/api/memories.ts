import { api } from './client';
export const memoriesApi = { list: () => api('/memories'), create: (memory:unknown) => api('/memories', { method:'POST', body:JSON.stringify(memory) }) };
