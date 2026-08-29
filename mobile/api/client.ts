import { queueAction } from '../services/storage';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
export async function api<T>(path:string, options:RequestInit = {}):Promise<T>{
  try {
    if (!API_URL) throw new Error('Mobile API is not configured. Set EXPO_PUBLIC_API_URL.');
    const response = await fetch(`${API_URL}${path}`, { ...options, headers:{'Content-Type':'application/json', ...(options.headers || {})} });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json();
  } catch (error) {
    if (options.method && options.method !== 'GET') await queueAction({ path, options });
    throw error instanceof Error ? error : new Error('Unable to reach the server');
  }
}
