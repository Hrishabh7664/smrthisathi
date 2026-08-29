export type Mood = 'Happy'|'Okay'|'Not great'|'Sad'|'Worried';
export type Activity = { id:string; title:string; icon:string; detail:string; completed?:boolean };
export type Reminder = { id:string; title:string; time:string; icon:string; done:boolean };
