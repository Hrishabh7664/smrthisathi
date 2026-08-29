import { api } from './client';
type Activity = { id: string; title: string; category: string; icon: string; detail: string; completed: boolean };
export const activitiesApi = { today: () => api<Activity[]>('/activities/today'), attempt: (id:string, score:number) => api(`/activities/${id}/attempt`, { method:'POST', body:JSON.stringify({ score }) }) };
