import { api } from './client';
export const remindersApi = { list: () => api('/reminders'), complete: (id:string) => api(`/reminders/${id}`, { method:'PATCH', body:JSON.stringify({ completed:true }) }) };
