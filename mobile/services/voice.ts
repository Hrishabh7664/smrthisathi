import * as Speech from 'expo-speech';
export const VoiceService = { speak: (text:string, language='en-IN') => Speech.speak(text, { language, rate: .85 }), listen: async () => null as string | null };
