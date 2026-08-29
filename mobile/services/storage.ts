import AsyncStorage from '@react-native-async-storage/async-storage';
export const storage = { get: async <T>(key:string, fallback:T):Promise<T> => { try { const value = await AsyncStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }, set: async (key:string, value:unknown) => AsyncStorage.setItem(key, JSON.stringify(value)) };
export const queueAction = async (action: unknown) => { const queue = await storage.get<unknown[]>('pending-actions', []); await storage.set('pending-actions', [...queue, action]); };
