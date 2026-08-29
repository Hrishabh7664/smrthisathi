import { api } from './client';
export const moodsApi = { create: (mood:string) => api('/moods', { method:'POST', body:JSON.stringify({ mood, timestamp:new Date().toISOString() }) }) };
