export type ProgressSnapshot = { completed: number; total: number; progress: number; streak: number };

const prompts = [
  (title: string) => `Tell me about your favourite part of ${title}.`,
  (title: string) => `What warm memory comes to mind when you see ${title}?`,
  (title: string) => `Who were you with for ${title}?`,
];

export const AIService = {
  generateMemoryPrompt(title: string) {
    const index = [...title].reduce((sum, character) => sum + character.charCodeAt(0), 0) % prompts.length;
    return prompts[index](title);
  },
  generateActivity(category: string) {
    return `A gentle ${category} activity for today.`;
  },
  summarizeCaregiverProgress(snapshot: ProgressSnapshot) {
    return `${snapshot.completed} of ${snapshot.total} activities complete (${snapshot.progress}%), with a ${snapshot.streak}-day streak.`;
  },
  translateContent(content: string, _language: string) {
    return content;
  },
};
