import { api } from './client';
type Dashboard = { today: { progress: number; completed: number; total: number }; streak: { current: number; best: number } };
export const patientsApi = { dashboard: () => api<Dashboard>('/patients/demo/dashboard'), profile: () => api('/patients/demo') };
