import { useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Heart,
  Home,
  Languages,
  LogOut,
  Mic,
  Phone,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  Volume2,
  X,
  VolumeX
} from 'lucide-react';
import { webApi, type ApiActivity, type ApiDashboard, type ApiMemory, type ApiReminder, type ApiPatient } from './api';
import { AIService } from './services/ai';

type Role = 'patient' | 'caregiver';
type Screen = 'home' | 'activities' | 'memories' | 'reminders' | 'profile' | 'dashboard' | 'patients' | 'progress' | 'settings' | 'manage';
type Language = 'en' | 'hi' | 'mr';

type Mood = { icon: string; label: string; tone: string };
const moods: Mood[] = [
  { icon: '😊', label: 'Happy', tone: 'gold' },
  { icon: '🙂', label: 'Okay', tone: 'mint' },
  { icon: '😐', label: 'Not great', tone: 'blue' },
  { icon: '😔', label: 'Sad', tone: 'rose' },
  { icon: '😟', label: 'Worried', tone: 'lavender' },
];

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    activities: 'Activities',
    memories: 'Memories',
    reminders: 'Reminders',
    profile: 'Profile',
    overview: 'Overview',
    myPeople: 'My people',
    progress: 'Progress',
    manage: 'Manage Plan',
    goodMorning: 'Good morning',
    tagline: 'Memories. Moments. Together.',
    subhead: 'A gentle start to a meaningful day.',
    listen: 'Listen',
    stopListening: 'Stop',
    startActivity: "Start today's activity",
    streak: 'day streak',
    forYouToday: 'For you today',
    brainExercise: 'Brain exercise',
    keepMindActive: 'Keep your mind active',
    howFeeling: 'How are you feeling?',
    checkIn: 'A moment to check in',
    myMemories: 'My memories',
    browseHappy: 'Browse happy moments',
    myReminders: 'My reminders',
    thingsForToday: 'Things for today',
    needToTalk: 'Need to talk to someone?',
    daughterCall: 'Your daughter Meera is just a call away.',
    callMeera: 'Call Meera',
    safeNote: 'These activities are for gentle engagement and enjoyment, not medical testing.',
    addMemory: 'Add memory',
    addReminder: 'Add reminder',
    tellMeAbout: 'Tell me about this',
    todayProgress: "Today's progress",
    switchRole: 'Switch role',
    patientSpace: 'YOUR SPACE',
    caregiverView: 'CAREGIVER VIEW',
    needHelp: 'Need help?',
    hereForYou: 'We are here for you',
    language: 'Language',
    accessibility: 'Accessibility',
  },
  hi: {
    home: 'होम',
    activities: 'गतिविधियाँ',
    memories: 'यादें',
    reminders: 'रिमाइंडर',
    profile: 'प्रोफ़ाइल',
    overview: 'समीक्षा',
    myPeople: 'अपने लोग',
    progress: 'प्रगति',
    manage: 'योजना प्रबंधन',
    goodMorning: 'सुप्रभात',
    tagline: 'यादें। पल। एक साथ।',
    subhead: 'एक सुखद और सार्थक दिन की शुरुआत।',
    listen: 'सुनें',
    stopListening: 'रोकें',
    startActivity: 'आज की गतिविधि शुरू करें',
    streak: 'दिन का सिलसिला',
    forYouToday: 'आज आपके लिए',
    brainExercise: 'दिमागी व्यायाम',
    keepMindActive: 'मन को सक्रिय रखें',
    howFeeling: 'आज आप कैसा महसूस कर रहे हैं?',
    checkIn: 'अपने मन की बात कहें',
    myMemories: 'मेरी यादें',
    browseHappy: 'प्यारे पलों को देखें',
    myReminders: 'मेरे रिमाइंडर',
    thingsForToday: 'आज के जरूरी काम',
    needToTalk: 'किसी से बात करनी है?',
    daughterCall: 'आपकी बेटी मीरा सिर्फ एक कॉल दूर है।',
    callMeera: 'मीरा को कॉल करें',
    safeNote: 'ये गतिविधियाँ आनंद और सहभागिता के लिए हैं, किसी चिकित्सकीय परीक्षण के लिए नहीं।',
    addMemory: 'याद जोड़ें',
    addReminder: 'रिमाइंडर जोड़ें',
    tellMeAbout: 'इसके बारे में बताएं',
    todayProgress: 'आज की प्रगति',
    switchRole: 'भूमिका बदलें',
    patientSpace: 'आपका स्थान',
    caregiverView: 'देखभालकर्ता कक्ष',
    needHelp: 'मदद चाहिए?',
    hereForYou: 'हम आपके साथ हैं',
    language: 'भाषा',
    accessibility: 'सुगमता',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    activities: 'उपक्रम',
    memories: 'आठवणी',
    reminders: 'स्मरणपत्रे',
    profile: 'प्रोफाइल',
    overview: 'आढावा',
    myPeople: 'माझी माणसे',
    progress: 'प्रगती',
    manage: 'नियोजन व्यवस्थापन',
    goodMorning: 'शुभ प्रभात',
    tagline: 'आठवणी. क्षण. एकत्र.',
    subhead: 'एका सुंदर आणि शांत दिवसाची सुरुवात.',
    listen: 'ऐका',
    stopListening: 'थांबवा',
    startActivity: 'आजचा उपक्रम सुरू करा',
    streak: 'दिवसांचे सातत्य',
    forYouToday: 'आज तुमच्यासाठी',
    brainExercise: 'मेंदूचा व्यायाम',
    keepMindActive: 'मन उत्साही ठेवा',
    howFeeling: 'आज तुम्हाला कसे वाटत आहे?',
    checkIn: 'मनाची स्थिती सांगा',
    myMemories: 'माझ्या आठवणी',
    browseHappy: 'आनंदाचे क्षण पहा',
    myReminders: 'माझी स्मरणपत्रे',
    thingsForToday: 'आजच्या महत्त्वाच्या गोष्टी',
    needToTalk: 'कोणाशी बोलायचे आहे का?',
    daughterCall: 'तुमची मुलगी मीरा फक्त एका फोनवर उपलब्ध आहे.',
    callMeera: 'मीराला फोन करा',
    safeNote: 'हे उपक्रम केवळ आनंद व मानसिक समाधानासाठी आहेत, वैद्यकीय चाचणीसाठी नाहीत.',
    addMemory: 'आठवण जोडा',
    addReminder: 'स्मरणपत्र जोडा',
    tellMeAbout: 'याबद्दल सांगा',
    todayProgress: 'आजची प्रगती',
    switchRole: 'भूमिका बदला',
    patientSpace: 'तुमची जागा',
    caregiverView: 'काळजीवाहू कक्ष',
    needHelp: 'मदत हवी आहे?',
    hereForYou: 'आम्ही सोबत आहोत',
    language: 'भाषा',
    accessibility: 'सुलभता',
  },
};

const fisherYates = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? 'light' : ''}`}>
      <span className="logo-mark">✦</span>
      <span>
        <b>smrithi</b> <strong>sathi</strong>
        <small>Memories. Moments. Together.</small>
      </span>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: any) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn ${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [role, setRole] = useState<Role | null>(() => (localStorage.getItem('smrithi-sathi-role') as Role | null) || 'patient');
  const [screen, setScreen] = useState<Screen>('home');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('smrithi-sathi-lang') as Language) || 'en');
  const [largeText, setLargeText] = useState(() => localStorage.getItem('ss_large_text') === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('ss_high_contrast') === 'true');

  const [completed, setCompleted] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [memories, setMemories] = useState<ApiMemory[]>([]);
  const [reminders, setReminders] = useState<ApiReminder[]>([]);
  const [activeActivity, setActiveActivity] = useState<ApiActivity | null>(null);
  const [showMood, setShowMood] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [toast, setToast] = useState('');
  const [speaking, setSpeaking] = useState(false);

  const [apiActivities, setApiActivities] = useState<ApiActivity[]>([]);
  const [managedActivities, setManagedActivities] = useState<ApiActivity[]>([]);
  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[lang] || translations.en;

  const refreshData = async () => {
    try {
      await webApi.login();
      const [nextDashboard, nextActivities, nextReminders, nextMemories, nextManagedActivities] = await Promise.all([
        webApi.dashboard(),
        webApi.activities(),
        webApi.reminders(),
        webApi.memories(),
        webApi.allActivities(),
      ]);
      setDashboard(nextDashboard);
      setApiActivities(nextActivities);
      setManagedActivities(nextManagedActivities);
      setCompleted(nextActivities.filter(item => item.completed).map(item => item.id));
      setReminders(nextReminders);
      setMemories(nextMemories);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Unable to load shared data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  const patientName = dashboard?.patient.name.split(' ')[0] ?? 'Asha';
  const progress = dashboard?.today.progress ?? 0;

  const go = (next: Screen) => {
    setScreen(next);
    setActiveActivity(null);
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  };

  const chooseRole = (next: Role) => {
    localStorage.setItem('smrithi-sathi-role', next);
    setRole(next);
    setScreen(next === 'patient' ? 'home' : 'dashboard');
    setActiveActivity(null);
  };

  const changeLanguage = (nextLang: Language) => {
    setLang(nextLang);
    localStorage.setItem('smrithi-sathi-lang', nextLang);
    notify(`Language set to ${nextLang === 'en' ? 'English' : nextLang === 'hi' ? 'हिन्दी' : 'मराठी'}`);
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    localStorage.setItem('ss_large_text', String(next));
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('ss_high_contrast', String(next));
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      notify(text);
    }
  };

  const completeActivity = async (selected: ApiActivity, score: number) => {
    await webApi.attempt(selected.id, score);
    setActiveActivity(null);
    await refreshData();
    notify(`Wonderful work! You scored ${score}%. Your progress is saved.`);
  };

  const saveMood = async (mood: Mood) => {
    setSelectedMood(mood);
    await webApi.mood(mood.label);
    await refreshData();
  };

  const addMemory = async (memory: { title: string; description: string; image: string; person: string }) => {
    await webApi.memory(memory);
    await refreshData();
    setShowMemory(false);
    notify('Your memory has been added.');
  };

  const addReminder = async (reminder: { title: string; time: string; icon: string; kind?: string }) => {
    await webApi.createReminder(reminder);
    await refreshData();
    setShowReminder(false);
    notify('Your reminder has been added.');
  };

  const toggleReminder = async (id: string, currentDone: boolean) => {
    await webApi.reminder(id, !currentDone);
    await refreshData();
  };

  const updateReminder = async (id: string, reminder: Partial<ApiReminder>) => {
    await webApi.updateReminder(id, reminder);
    await refreshData();
    notify('Reminder updated.');
  };

  const deleteReminder = async (id: string) => {
    await webApi.deleteReminder(id);
    await refreshData();
    notify('Reminder removed.');
  };

  const addActivity = async (activity: Partial<ApiActivity>) => {
    await webApi.createActivity(activity);
    await refreshData();
    notify('Activity added to schedule.');
  };

  const updateActivity = async (id: string, activity: Partial<ApiActivity>) => {
    await webApi.updateActivity(id, activity);
    await refreshData();
    notify('Activity status updated.');
  };

  const updatePatient = async (patient: Partial<ApiPatient>) => {
    await webApi.updatePatient(patient);
    await refreshData();
    notify('Patient profile updated.');
  };

  if (!role) {
    return <RolePicker choose={chooseRole} lang={lang} t={t} />;
  }

  return (
    <div className={`app-shell ${largeText ? 'large-text-mode' : ''} ${highContrast ? 'high-contrast-mode' : ''}`}>
      <header className="topbar">
        <Logo />
        <div className="top-actions">
          <div className="language-selector">
            <Languages size={16} />
            <select
              value={lang}
              onChange={e => changeLanguage(e.target.value as Language)}
              className="lang-select"
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
          <button
            className="role-pill-btn"
            onClick={() => chooseRole(role === 'patient' ? 'caregiver' : 'patient')}
            title="Click to switch between Patient & Caregiver mode"
          >
            <span className="avatar-dot">{role === 'patient' ? 'AP' : 'RS'}</span>
            <span className="role-label">{role === 'patient' ? 'Patient' : 'Caregiver'}</span>
          </button>
        </div>
      </header>

      {role === 'patient' ? (
        <PatientLayout
          screen={screen}
          go={go}
          t={t}
          name={patientName}
          progress={progress}
          completed={completed}
          reminders={reminders}
          memories={memories}
          activities={apiActivities}
          speaking={speaking}
          onSpeak={handleSpeak}
          onSwitch={() => chooseRole('caregiver')}
          onMood={() => setShowMood(true)}
          onMemory={() => setShowMemory(true)}
          onReminderAdd={() => setShowReminder(true)}
          onCall={() => setShowCallModal(true)}
          onActivity={(act: ApiActivity) => setActiveActivity(act)}
          onReminderToggle={(id: string, done: boolean) => toggleReminder(id, done)}
          onMemoryPrompt={(memory: ApiMemory) => {
            const prompt = AIService.generateMemoryPrompt(memory.title);
            notify(prompt);
            handleSpeak(prompt);
          }}
          largeText={largeText}
          toggleLargeText={toggleLargeText}
          highContrast={highContrast}
          toggleHighContrast={toggleHighContrast}
          lang={lang}
          changeLanguage={changeLanguage}
        />
      ) : (
        <CaregiverLayout
          screen={screen}
          go={go}
          t={t}
          onSwitch={() => chooseRole('patient')}
          name={patientName}
          dashboard={dashboard}
          activities={apiActivities}
          managedActivities={managedActivities}
          reminders={reminders}
          memories={memories}
          onReminderUpdate={updateReminder}
          onReminderDelete={deleteReminder}
          onReminderAdd={() => setShowReminder(true)}
          onActivityAdd={addActivity}
          onActivityUpdate={updateActivity}
          onPatientUpdate={updatePatient}
          patient={dashboard?.patient}
        />
      )}

      {activeActivity && (
        <GameplayModal
          activity={activeActivity}
          close={() => setActiveActivity(null)}
          complete={(score: number) => completeActivity(activeActivity, score)}
        />
      )}

      {showMood && (
        <MoodModal
          selectedMood={selectedMood}
          setSelectedMood={(m: Mood) => {
            void saveMood(m);
          }}
          close={() => setShowMood(false)}
          notify={notify}
          t={t}
        />
      )}

      {showMemory && (
        <MemoryModal
          close={() => setShowMemory(false)}
          add={addMemory}
          t={t}
        />
      )}

      {showReminder && (
        <ReminderModal
          close={() => setShowReminder(false)}
          add={addReminder}
          t={t}
        />
      )}

      {showCallModal && (
        <CallModal
          patient={dashboard?.patient}
          close={() => setShowCallModal(false)}
          notify={notify}
        />
      )}

      {toast && (
        <div className="toast">
          <Check size={18} />
          <span>{toast}</span>
        </div>
      )}

      <footer>Smrithi Sathi is a cognitive support and engagement tool. It does not diagnose or treat medical conditions.</footer>
    </div>
  );
}

function RolePicker({ choose, t }: { choose: (role: Role) => void; lang: Language; t: Record<string, string> }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
      </header>
      <main className="main-content" style={{ maxWidth: '680px', margin: '40px auto' }}>
        <div className="page-title" style={{ textAlign: 'center' }}>
          <div className="eyebrow">WELCOME TO SMRITHI SATHI</div>
          <h1>Are you a Patient or a Caregiver?</h1>
          <p className="subhead">Choose your personalized space for today.</p>
        </div>
        <div className="quick-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <button className="quick-card peach" onClick={() => choose('patient')} style={{ padding: '24px' }}>
            <span className="quick-icon" style={{ fontSize: '36px' }}>💛</span>
            <b style={{ fontSize: '18px' }}>I am a Patient</b>
            <small style={{ fontSize: '13px', marginTop: '8px' }}>Gentle brain exercises, memories, reminders, and daily check-in.</small>
            <ChevronRight size={22} style={{ position: 'absolute', right: '16px', bottom: '16px' }} />
          </button>
          <button className="quick-card mint" onClick={() => choose('caregiver')} style={{ padding: '24px' }}>
            <span className="quick-icon" style={{ fontSize: '36px' }}>👨‍👩‍👧</span>
            <b style={{ fontSize: '18px' }}>I am a Caregiver</b>
            <small style={{ fontSize: '13px', marginTop: '8px' }}>Monitor daily progress, manage activities, and sync care schedules.</small>
            <ChevronRight size={22} style={{ position: 'absolute', right: '16px', bottom: '16px' }} />
          </button>
        </div>
      </main>
      <footer>Smrithi Sathi is a cognitive support and engagement tool.</footer>
    </div>
  );
}

function PatientLayout({
  screen,
  go,
  t,
  name,
  progress,
  completed,
  reminders,
  memories,
  activities,
  speaking,
  onSpeak,
  onSwitch,
  onMood,
  onMemory,
  onReminderAdd,
  onCall,
  onActivity,
  onReminderToggle,
  onMemoryPrompt,
  largeText,
  toggleLargeText,
  highContrast,
  toggleHighContrast,
  lang,
  changeLanguage,
}: any) {
  const nav = [
    { id: 'home', icon: Home, label: t.home || 'Home' },
    { id: 'activities', icon: Brain, label: t.activities || 'Activities' },
    { id: 'memories', icon: BookOpen, label: t.memories || 'Memories' },
    { id: 'reminders', icon: Bell, label: t.reminders || 'Reminders' },
    { id: 'profile', icon: UserRound, label: t.profile || 'Profile' },
  ];

  return (
    <div className="workspace patient-workspace">
      <aside className="sidebar">
        <div className="side-caption">{t.patientSpace || 'YOUR SPACE'}</div>
        {nav.map(n => (
          <button
            key={n.id}
            className={screen === n.id ? 'active' : ''}
            onClick={() => go(n.id as Screen)}
          >
            <n.icon size={20} />
            <span>{n.label}</span>
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="help-card" onClick={onCall} style={{ cursor: 'pointer' }}>
            <CircleHelp size={22} />
            <div>
              <b>{t.needHelp || 'Need help?'}</b>
              <small>{t.hereForYou || 'We are here for you'}</small>
            </div>
          </div>
          <button onClick={onSwitch}>
            <LogOut size={18} />
            <span>{t.switchRole || 'Switch role'}</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        {screen === 'home' && (
          <PatientHome
            name={name}
            progress={progress}
            completedCount={completed.length}
            totalCount={activities.length}
            onMood={onMood}
            onMemory={onMemory}
            onCall={onCall}
            go={go}
            t={t}
            speaking={speaking}
            onSpeak={onSpeak}
          />
        )}
        {screen === 'activities' && (
          <Activities
            completed={completed}
            activities={activities}
            onActivity={onActivity}
            t={t}
          />
        )}
        {screen === 'memories' && (
          <Memories
            memories={memories}
            onAdd={onMemory}
            onPrompt={onMemoryPrompt}
            t={t}
          />
        )}
        {screen === 'reminders' && (
          <Reminders
            reminders={reminders}
            onToggle={onReminderToggle}
            onAdd={onReminderAdd}
            t={t}
          />
        )}
        {screen === 'profile' && (
          <Profile
            name={name}
            t={t}
            largeText={largeText}
            toggleLargeText={toggleLargeText}
            highContrast={highContrast}
            toggleHighContrast={toggleHighContrast}
            lang={lang}
            changeLanguage={changeLanguage}
            onCall={onCall}
          />
        )}
      </main>
    </div>
  );
}

function PatientHome({
  name,
  progress,
  completedCount,
  totalCount,
  onMood,
  onMemory,
  onCall,
  go,
  t,
  speaking,
  onSpeak,
}: any) {
  const currentDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const listenText = `Good morning ${name}. Welcome to Smrithi Sathi. You have completed ${completedCount} out of ${totalCount} activities today, and your current streak is 5 days. Take your time and enjoy your day.`;

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            {currentDateStr.toUpperCase()} <span className="live-dot" /> LIVE
          </div>
          <h1>
            {t.goodMorning || 'Good morning'}, {name} <span className="wave">👋</span>
          </h1>
          <p className="subhead">{t.subhead || 'A gentle start to a meaningful day.'}</p>
        </div>
        <Button
          variant="soft"
          onClick={() => onSpeak(listenText)}
          className={speaking ? 'speaking-active' : ''}
        >
          {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>{speaking ? t.stopListening || 'Stop' : t.listen || 'Listen'}</span>
        </Button>
      </div>

      <div className="patient-grid">
        <section className="hero-card">
          <div>
            <span className="tag">YOUR DAILY RHYTHM</span>
            <h2>
              A little progress<br />
              <em>goes a long way.</em>
            </h2>
            <p>Take a few moments for yourself today with simple, enjoyable exercises.</p>
            <Button onClick={() => go('activities')}>
              {t.startActivity || "Start today's activity"} <ChevronRight size={19} />
            </Button>
          </div>
          <div className="sun-art">
            ☀️<span>✦</span>
          </div>
        </section>

        <section className="progress-card">
          <div className="card-heading">
            <span>{t.todayProgress || "Today's progress"}</span>
            <b>{progress}%</b>
          </div>
          <div className="progress-track">
            <i style={{ width: `${Math.max(8, progress)}%` }} />
          </div>
          <div className="progress-foot">
            <span>
              <Check size={14} /> {completedCount} of {totalCount || 4} complete
            </span>
            <span className="streak">
              <span>✦</span> 5 {t.streak || 'day streak'}
            </span>
          </div>
        </section>

        <section className="quick-section">
          <div className="section-title">
            <h3>{t.forYouToday || 'For you today'}</h3>
            <button onClick={() => go('activities')}>
              See all <ChevronRight size={15} />
            </button>
          </div>
          <div className="quick-grid">
            <QuickCard
              icon="🧠"
              title={t.brainExercise || 'Brain exercise'}
              copy={t.keepMindActive || 'Keep your mind active'}
              color="peach"
              onClick={() => go('activities')}
            />
            <QuickCard
              icon="💛"
              title={t.howFeeling || 'How are you feeling?'}
              copy={t.checkIn || 'A moment to check in'}
              color="gold"
              onClick={onMood}
            />
            <QuickCard
              icon="🖼️"
              title={t.myMemories || 'My memories'}
              copy={t.browseHappy || 'Browse happy moments'}
              color="lavender"
              onClick={onMemory}
            />
            <QuickCard
              icon="🔔"
              title={t.myReminders || 'My reminders'}
              copy={t.thingsForToday || 'Things for today'}
              color="mint"
              onClick={() => go('reminders')}
            />
          </div>
        </section>

        <section className="care-card">
          <div className="care-icon">
            <Phone size={22} />
          </div>
          <div>
            <b>{t.needToTalk || 'Need to talk to someone?'}</b>
            <p>{t.daughterCall || 'Your daughter Meera is just a call away.'}</p>
          </div>
          <Button variant="outline" onClick={onCall}>
            {t.callMeera || 'Call Meera'}
          </Button>
        </section>
      </div>
    </>
  );
}

function QuickCard({ icon, title, copy, color, onClick }: any) {
  return (
    <button className={`quick-card ${color}`} onClick={onClick}>
      <span className="quick-icon">{icon}</span>
      <b>{title}</b>
      <small>{copy}</small>
      <ChevronRight size={17} />
    </button>
  );
}

function Activities({ completed, activities, onActivity, t }: any) {
  return (
    <>
      <div className="page-title">
        <div className="eyebrow">A QUIET MOMENT FOR YOU</div>
        <h1>{t.activities || "Today's activities"}</h1>
        <p className="subhead">Choose one to begin. There is no hurry.</p>
      </div>

      <div className="activity-summary">
        <div className="summary-icon">✦</div>
        <div>
          <b>
            {completed.length} of {activities.length} activities complete
          </b>
          <p>Every activity is a chance to keep your mind engaged and happy.</p>
        </div>
        <span className="summary-streak">🔥 5 days</span>
      </div>

      <div className="activity-list">
        {activities.map((a: ApiActivity) => (
          <button
            className="activity-row"
            key={a.id}
            onClick={() => onActivity(a)}
          >
            <span className="activity-emoji mint">{a.icon}</span>
            <span className="activity-copy">
              <small>
                {a.category} · {a.difficulty}
              </small>
              <b>{a.title}</b>
              <span>{a.detail}</span>
            </span>
            {a.completed || completed.includes(a.id) ? (
              <span className="done-pill">
                <Check size={15} /> Done
              </span>
            ) : (
              <ChevronRight className="row-chevron" />
            )}
          </button>
        ))}
      </div>

      <div className="safe-note">
        <Sparkles size={17} />
        <span>{t.safeNote || 'These activities are for gentle engagement and enjoyment, not medical testing.'}</span>
      </div>
    </>
  );
}

function Memories({ memories, onAdd, onPrompt, t }: any) {
  return (
    <>
      <div className="page-title with-action">
        <div>
          <div className="eyebrow">PEOPLE AND MOMENTS YOU LOVE</div>
          <h1>{t.myMemories || 'My memories'}</h1>
          <p className="subhead">Your special moments, kept close.</p>
        </div>
        <Button onClick={onAdd}>
          <Plus size={18} /> {t.addMemory || 'Add memory'}
        </Button>
      </div>

      <div className="memory-grid">
        {memories.map((m: ApiMemory) => (
          <div className="memory-card" key={m.id}>
            <div className="memory-image">
              {m.image}
              <span>♡</span>
            </div>
            <div className="memory-body">
              <small>
                {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {m.person}
              </small>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <button className="memory-prompt" onClick={() => onPrompt(m)}>
                <Sparkles size={15} /> {t.tellMeAbout || 'Tell me about this'} <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Reminders({ reminders, onToggle, onAdd, t }: any) {
  return (
    <>
      <div className="page-title with-action">
        <div>
          <div className="eyebrow">A SIMPLE RHYTHM FOR YOUR DAY</div>
          <h1>{t.myReminders || 'My reminders'}</h1>
          <p className="subhead">Small things that help your day go smoothly.</p>
        </div>
        <Button variant="soft" onClick={onAdd}>
          <Plus size={18} /> {t.addReminder || 'Add reminder'}
        </Button>
      </div>

      <div className="date-strip">
        <b>Today</b>
        <span>Wed 28</span>
        <span>Thu 29</span>
        <span>Fri 30</span>
      </div>

      <div className="reminder-list">
        {reminders.map((r: ApiReminder) => (
          <div className={`reminder-row ${r.done ? 'reminder-done' : ''}`} key={r.id}>
            <span className="reminder-icon">{r.icon}</span>
            <div style={{ flex: 1 }}>
              <small>{r.kind || 'Daily care'}</small>
              <h3>{r.title}</h3>
            </div>
            <strong>{r.time}</strong>
            <button
              className={`check-button ${r.done ? 'checked' : ''}`}
              onClick={() => onToggle(r.id, r.done)}
              aria-label={r.done ? 'Mark pending' : 'Mark done'}
            >
              {r.done ? <Check size={18} /> : <span />}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Profile({
  name,
  t,
  largeText,
  toggleLargeText,
  highContrast,
  toggleHighContrast,
  lang,
  changeLanguage,
  onCall,
}: any) {
  return (
    <>
      <div className="page-title">
        <div className="eyebrow">YOUR PROFILE</div>
        <h1>Hello, {name}</h1>
        <p className="subhead">Settings to make Smrithi Sathi comfortable and familiar.</p>
      </div>

      <div className="profile-card">
        <div className="big-avatar">AP</div>
        <div>
          <h2>{name} Patil</h2>
          <p>
            Preferred language: <b>{lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी (Hindi)' : 'मराठी (Marathi)'}</b>
          </p>
          <p>
            Caregiver: <b>Meera Patil (Daughter)</b>
          </p>
        </div>
        <Button variant="outline" onClick={onCall}>
          <Phone size={16} /> Contact Meera
        </Button>
      </div>

      <div className="settings-list">
        <div>
          <Languages />
          <span>
            <b>Language Selection</b>
            <small>Choose English, Hindi, or Marathi</small>
          </span>
          <select
            value={lang}
            onChange={e => changeLanguage(e.target.value as Language)}
            className="lang-select-inline"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        <div>
          <Settings />
          <span>
            <b>Larger Text Size</b>
            <small>Make fonts bigger and easier to read</small>
          </span>
          <button
            className={`toggle-btn ${largeText ? 'active' : ''}`}
            onClick={toggleLargeText}
          >
            {largeText ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div>
          <Sparkles />
          <span>
            <b>High Contrast Visuals</b>
            <small>Enhance borders and contrast for clarity</small>
          </span>
          <button
            className={`toggle-btn ${highContrast ? 'active' : ''}`}
            onClick={toggleHighContrast}
          >
            {highContrast ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </>
  );
}

function CaregiverLayout({
  screen,
  go,
  onSwitch,
  name,
  dashboard,
  activities,
  managedActivities,
  reminders,
  memories,
  onReminderUpdate,
  onReminderDelete,
  onReminderAdd,
  onActivityAdd,
  onActivityUpdate,
  onPatientUpdate,
  patient,
}: any) {
  const nav = [
    { id: 'dashboard', icon: Home, label: 'Overview' },
    { id: 'patients', icon: Users, label: 'My people' },
    { id: 'progress', icon: TrendingUp, label: 'Progress' },
    { id: 'memories', icon: BookOpen, label: 'Memories' },
    { id: 'reminders', icon: Bell, label: 'Reminders' },
    { id: 'manage', icon: Settings, label: 'Manage' },
  ];

  const live = dashboard
    ? AIService.summarizeCaregiverProgress({
        completed: dashboard.today.completed,
        total: dashboard.today.total,
        progress: dashboard.today.progress,
        streak: dashboard.streak.current,
      })
    : 'Synchronizing live data...';

  return (
    <div className="workspace caregiver-workspace">
      <aside className="sidebar caregiver-side">
        <div className="care-brand">
          <Logo />
          <span>CAREGIVER VIEW</span>
        </div>
        {nav.map(n => (
          <button
            key={n.id}
            className={screen === n.id ? 'active' : ''}
            onClick={() => go(n.id as Screen)}
          >
            <n.icon size={19} />
            <span>{n.label}</span>
          </button>
        ))}
        <div className="sidebar-bottom">
          <button onClick={onSwitch}>
            <LogOut size={18} />
            <span>Switch to patient</span>
          </button>
        </div>
      </aside>

      <main className="main-content caregiver-main">
        <div className="care-top">
          <div>
            <div className="eyebrow">
              CAREGIVER DASHBOARD <span className="live-dot" /> LIVE SYNC
            </div>
            <h1>{screen === 'dashboard' ? 'Good morning, Rohan' : nav.find(n => n.id === screen)?.label}</h1>
          </div>
          <div className="care-profile">
            <span>RS</span>
            <div>
              <b>Rohan Shah</b>
              <small>Caregiver</small>
            </div>
          </div>
        </div>

        {screen === 'dashboard' && (
          <div className="activity-summary">
            <div className="summary-icon">✦</div>
            <div>
              <b>Live patient sync status</b>
              <p>{live}</p>
            </div>
          </div>
        )}

        {screen === 'dashboard' && <CareDashboard name={name} go={go} dashboard={dashboard} />}
        {screen === 'progress' && <CareProgress dashboard={dashboard} />}
        {screen === 'patients' && <Patients name={name} patient={patient} />}
        {screen === 'memories' && <CareMemories memories={memories} />}
        {screen === 'reminders' && (
          <CareReminders
            reminders={reminders}
            onAdd={onReminderAdd}
            onDelete={onReminderDelete}
          />
        )}
        {screen === 'manage' && (
          <ManageBoard
            patient={patient}
            reminders={reminders}
            activities={managedActivities}
            onReminderUpdate={onReminderUpdate}
            onReminderDelete={onReminderDelete}
            onActivityAdd={onActivityAdd}
            onActivityUpdate={onActivityUpdate}
            onPatientUpdate={onPatientUpdate}
          />
        )}
      </main>
    </div>
  );
}

function CareDashboard({ name, go, dashboard }: any) {
  return (
    <>
      <div className="alert-banner">
        <span>✦</span>
        <div>
          <b>A gentle check-in may help today</b>
          <p>Asha has completed her morning orientation. Consider calling her around chai time.</p>
        </div>
        <button onClick={() => alert('Check-in reminder noted.')}>Note for later</button>
      </div>

      <div className="patient-header">
        <div className="patient-avatar">AP</div>
        <div>
          <div className="eyebrow">SELECTED PERSON</div>
          <h2>
            {name} Patil <span className="verified">✓</span>
          </h2>
          <p>Age 68 · Pune, Maharashtra · Active today</p>
        </div>
        <Button variant="outline" onClick={() => go('manage')}>
          Manage Plan
        </Button>
      </div>

      <div className="stat-grid">
        <Stat
          icon="✦"
          label="Today’s progress"
          value={dashboard ? `${dashboard.today.completed} / ${dashboard.today.total}` : '—'}
          trend={dashboard ? `${dashboard.today.progress}% complete · ${dashboard.today.averageScore}% avg score` : 'Loading'}
          color="peach"
        />
        <Stat
          icon="🔥"
          label="Current streak"
          value={dashboard ? `${dashboard.streak.current} days` : '—'}
          trend={dashboard ? `Best: ${dashboard.streak.best} days` : 'Loading'}
          color="gold"
        />
        <Stat
          icon="😊"
          label="Today’s mood"
          value={dashboard?.mood?.mood || 'Happy'}
          trend={dashboard?.mood ? 'Checked in today' : 'Awaiting check-in'}
          color="mint"
        />
        <Stat
          icon="◷"
          label="Time together"
          value="18 min"
          trend="This week · steady"
          color="lavender"
        />
      </div>

      <div className="dashboard-columns">
        <section className="panel">
          <div className="panel-title">
            <div>
              <h3>Activity engagement</h3>
              <p>Last 7 days · Engagement frequency</p>
            </div>
            <button onClick={() => go('progress')}>
              View details <ChevronRight size={15} />
            </button>
          </div>
          <MiniChart />
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h3>Today’s activity status</h3>
              <p>{dashboard?.today.completed || 0} completed · shared from patient device</p>
            </div>
            <Activity size={19} />
          </div>
          <div className="task-list">
            <Task
              label="Morning Orientation"
              time={dashboard?.today.completed ? `${dashboard.today.averageScore}% average score` : 'Pending'}
              done={Boolean(dashboard?.today.completed)}
            />
            <Task
              label="Mood check-in"
              time={dashboard?.mood?.mood ? `Reported: ${dashboard.mood.mood}` : 'Pending'}
              done={Boolean(dashboard?.mood)}
            />
            <Task
              label="Reminders and daily care"
              time="Synchronized in real-time"
              done
            />
          </div>
        </section>
      </div>

      <section className="panel reminder-panel">
        <div className="panel-title">
          <div>
            <h3>Upcoming reminders</h3>
            <p>For Asha today</p>
          </div>
          <button onClick={() => go('reminders')}>
            Manage reminders <ChevronRight size={15} />
          </button>
        </div>
        <div className="upcoming">
          <span>💧</span>
          <div>
            <b>Drink some water</b>
            <small>Wellness · Every day</small>
          </div>
          <strong>10:00 AM</strong>
          <span className="upcoming-status">Due soon</span>
        </div>
        <div className="upcoming">
          <span>📞</span>
          <div>
            <b>Call Meera</b>
            <small>Family call · Every day</small>
          </div>
          <strong>6:00 PM</strong>
          <span className="upcoming-status muted">Scheduled</span>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, label, value, trend, color }: any) {
  return (
    <div className={`stat-card ${color}`}>
      <span className="stat-icon">{icon}</span>
      <small>{label}</small>
      <b>{value}</b>
      <p>{trend}</p>
    </div>
  );
}

function MiniChart() {
  const bars = [
    { day: 'M', height: 75 },
    { day: 'T', height: 85 },
    { day: 'W', height: 65 },
    { day: 'T', height: 95 },
    { day: 'F', height: 80 },
    { day: 'S', height: 90 },
    { day: 'S', height: 88 },
  ];
  return (
    <div className="chart">
      <div className="chart-bars">
        {bars.map((item, i) => (
          <div className="bar-col" key={i}>
            <span style={{ height: `${item.height}%` }} />
            <small>{item.day}</small>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <span>
          <i /> Activities completed
        </span>
        <b>83% 7-day average</b>
      </div>
    </div>
  );
}

function Task({ label, time, done }: any) {
  return (
    <div className="task">
      <span className={done ? 'task-check done' : 'task-check'}>
        {done && <Check size={13} />}
      </span>
      <div>
        <b>{label}</b>
        <small>{time}</small>
      </div>
      {done ? <em>Done</em> : <em className="pending">Upcoming</em>}
    </div>
  );
}

function CareProgress({ dashboard }: any) {
  return (
    <>
      <div className="page-title">
        <div className="eyebrow">ENGAGEMENT TRENDS</div>
        <h1>Asha’s progress</h1>
        <p className="subhead">Helpful patterns from the past two weeks. This is not a medical assessment.</p>
      </div>

      <div className="progress-big">
        <div>
          <span>Activities completed</span>
          <strong>19</strong>
          <small>out of 22 planned</small>
        </div>
        <div>
          <span>Average activity score</span>
          <strong>86%</strong>
          <small>steady positive trend</small>
        </div>
        <div>
          <span>Days active</span>
          <strong>12</strong>
          <small>of the last 14 days</small>
        </div>
      </div>

      <section className="panel full-chart">
        <div className="panel-title">
          <div>
            <h3>Weekly activity engagement</h3>
            <p>Completed cognitive exercises per day</p>
          </div>
          <span className="chart-pill">Last 7 days</span>
        </div>
        <MiniChart />
      </section>

      <div className="trend-note">
        <Sparkles size={18} />
        <span>
          Asha is most consistent with memory match and familiar recognition activities. Keeping the daily routine gentle and familiar is showing excellent engagement.
        </span>
      </div>
    </>
  );
}

function Patients({ name, patient }: any) {
  return (
    <>
      <div className="page-title">
        <div className="eyebrow">YOUR PEOPLE</div>
        <h1>My people</h1>
        <p className="subhead">The people you care for, all in one place.</p>
      </div>

      <div className="people-card">
        <div className="patient-avatar">AP</div>
        <div>
          <h2>{patient?.name || `${name} Patil`}</h2>
          <p>Age {patient?.age || 68} · {patient?.city || 'Pune, Maharashtra'} · Active today</p>
          <p style={{ color: '#2e6458', fontWeight: 600, fontSize: '12px' }}>Emergency Contact: {patient?.phone || '+91 98230 12345'}</p>
        </div>
        <span className="active-badge">● Active</span>
        <ChevronRight />
      </div>
    </>
  );
}

function CareMemories({ memories }: any) {
  return (
    <>
      <div className="page-title">
        <div className="eyebrow">MEMORY JOURNAL</div>
        <h1>Asha’s memories</h1>
        <p className="subhead">Moments and photo reflections that spark warm conversations.</p>
      </div>

      <div className="memory-grid">
        {memories.map((m: ApiMemory) => (
          <div className="memory-card" key={m.id}>
            <div className="memory-image">{m.image}</div>
            <div className="memory-body">
              <small>
                {new Date(m.createdAt).toLocaleDateString()} · {m.person}
              </small>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CareReminders({ reminders, onAdd, onDelete }: any) {
  return (
    <>
      <div className="page-title with-action">
        <div>
          <div className="eyebrow">DAILY RHYTHM</div>
          <h1>Asha’s reminders</h1>
          <p className="subhead">Keep daily medications, hydration, and family calls on track.</p>
        </div>
        <Button onClick={onAdd}>
          <Plus size={18} /> Add reminder
        </Button>
      </div>

      <div className="reminder-list">
        {reminders.map((r: ApiReminder) => (
          <div className="reminder-row" key={r.id}>
            <span className="reminder-icon">{r.icon}</span>
            <div style={{ flex: 1 }}>
              <small>{r.kind || 'Daily care'}</small>
              <h3>{r.title}</h3>
            </div>
            <strong>{r.time}</strong>
            <span className={r.done ? 'done-pill' : 'upcoming-status'}>
              {r.done ? 'Completed' : 'Upcoming'}
            </span>
            <button
              onClick={() => onDelete(r.id)}
              style={{ background: 'none', border: 'none', color: '#b26857', cursor: 'pointer', padding: '6px' }}
              title="Delete Reminder"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function ManageBoard({
  patient,
  reminders,
  activities,
  onReminderUpdate,
  onReminderDelete,
  onActivityAdd,
  onActivityUpdate,
  onPatientUpdate,
}: any) {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    city: '',
    phone: '',
  });
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [activity, setActivity] = useState({
    title: '',
    time: '12:00',
    category: 'Memory',
    icon: '🧠',
    detail: 'Gentle exercise',
  });

  useEffect(() => {
    if (patient) {
      setProfile({
        name: patient.name,
        age: String(patient.age),
        city: patient.city,
        phone: patient.phone || '+91 98230 12345',
      });
    }
  }, [patient]);

  return (
    <>
      <div className="page-title">
        <div className="eyebrow">CAREGIVER TOOLS</div>
        <h1>Manage Asha’s plan</h1>
        <p className="subhead">Keep reminders, activities, and emergency details synchronized.</p>
      </div>

      <section className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-title">
          <div>
            <h3>Patient profile</h3>
            <p>Details shared across patient and caregiver viewports.</p>
          </div>
        </div>
        <div className="form-modal" style={{ padding: 0, boxShadow: 'none' }}>
          <label>
            Name
            <input
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
          </label>
          <label>
            Age
            <input
              type="number"
              value={profile.age}
              onChange={e => setProfile({ ...profile, age: e.target.value })}
            />
          </label>
          <label>
            City
            <input
              value={profile.city}
              onChange={e => setProfile({ ...profile, city: e.target.value })}
            />
          </label>
          <label>
            Emergency Contact Phone
            <input
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
            />
          </label>
          <Button
            onClick={() =>
              onPatientUpdate({
                name: profile.name,
                age: Number(profile.age) || 68,
                city: profile.city,
                phone: profile.phone,
              })
            }
          >
            Save profile <Check size={17} />
          </Button>
        </div>
      </section>

      <section className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-title">
          <div>
            <h3>Reminders</h3>
            <p>Edit or remove daily reminders.</p>
          </div>
        </div>
        <div className="reminder-list">
          {reminders.map((reminder: ApiReminder) =>
            editingReminder?.id === reminder.id ? (
              <div className="form-modal" key={reminder.id} style={{ padding: '16px', border: '1px solid #c2ded0' }}>
                <label>
                  Title
                  <input
                    value={editingReminder.title}
                    onChange={e => setEditingReminder({ ...editingReminder, title: e.target.value })}
                  />
                </label>
                <label>
                  Time
                  <input
                    value={editingReminder.time}
                    onChange={e => setEditingReminder({ ...editingReminder, time: e.target.value })}
                  />
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <Button
                    onClick={() => {
                      onReminderUpdate(reminder.id, editingReminder);
                      setEditingReminder(null);
                    }}
                  >
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingReminder(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="reminder-row" key={reminder.id}>
                <span className="reminder-icon">{reminder.icon}</span>
                <div style={{ flex: 1 }}>
                  <small>{reminder.kind || 'Daily care'}</small>
                  <h3>{reminder.title}</h3>
                </div>
                <strong>{reminder.time}</strong>
                <Button
                  variant="soft"
                  onClick={() =>
                    setEditingReminder({
                      id: reminder.id,
                      title: reminder.title,
                      time: reminder.time,
                    })
                  }
                >
                  Edit
                </Button>
                <button
                  onClick={() => onReminderDelete(reminder.id)}
                  style={{ background: 'none', border: 'none', color: '#b26857', cursor: 'pointer', padding: '6px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <div>
            <h3>Assigned activities</h3>
            <p>Assign gentle exercises or pause existing ones.</p>
          </div>
        </div>
        <div className="form-modal" style={{ padding: 0, boxShadow: 'none', marginBottom: '20px' }}>
          <label>
            Activity title
            <input
              value={activity.title}
              onChange={e => setActivity({ ...activity, title: e.target.value })}
              placeholder="e.g. Garden flower recall"
            />
          </label>
          <label>
            Category
            <input
              value={activity.category}
              onChange={e => setActivity({ ...activity, category: e.target.value })}
            />
          </label>
          <Button
            onClick={() => {
              if (!activity.title) return;
              onActivityAdd(activity);
              setActivity({ title: '', time: '12:00', category: 'Memory', icon: '🧠', detail: 'Gentle exercise' });
            }}
          >
            Add activity <Plus size={17} />
          </Button>
        </div>

        <div className="activity-list">
          {activities.map((item: ApiActivity) => (
            <div className="activity-row" key={item.id}>
              <span className="activity-emoji mint">{item.icon}</span>
              <span className="activity-copy">
                <small>{item.category}</small>
                <b>{item.title}</b>
                <span>{item.active ? 'Assigned to Asha' : 'Paused'}</span>
              </span>
              <Button
                variant={item.active ? 'outline' : 'soft'}
                onClick={() => onActivityUpdate(item.id, { active: !item.active })}
              >
                {item.active ? 'Pause' : 'Activate'}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function MoodModal({
  selectedMood,
  setSelectedMood,
  close,
  notify,
  t,
}: any) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={close} aria-label="Close">
          <X />
        </button>
        <span className="modal-spark">💛</span>
        <div className="eyebrow">A SMALL MOMENT FOR YOU</div>
        <h2>{t.howFeeling || 'How are you feeling today?'}</h2>
        <p>There is no right or wrong answer. Take a gentle breath.</p>
        <div className="mood-options">
          {moods.map(m => (
            <button
              key={m.label}
              className={selectedMood?.label === m.label ? `selected ${m.tone}` : ''}
              onClick={() => {
                setSelectedMood(m);
                notify(`Feeling ${m.label.toLowerCase()} — thank you for sharing with us.`);
                close();
              }}
            >
              <span>{m.icon}</span>
              <b>{m.label}</b>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MemoryModal({ close, add, t }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [person, setPerson] = useState('Family');
  const [image, setImage] = useState('🌼');
  const icons = ['🌼', '🪔', '🏡', '🍵', '👨‍👩‍👧', '🌿', '🪁', '🍛'];

  return (
    <div className="modal-backdrop">
      <div className="modal form-modal">
        <button className="modal-close" onClick={close} aria-label="Close">
          <X />
        </button>
        <span className="modal-spark">{image}</span>
        <div className="eyebrow">KEEP A MOMENT CLOSE</div>
        <h2>{t.addMemory || 'Add a memory'}</h2>
        <p>Write a few words about a moment you love.</p>
        <label>
          Memory title
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Making chai with Meera"
          />
        </label>
        <label>
          Person or relation
          <input
            value={person}
            onChange={e => setPerson(e.target.value)}
            placeholder="e.g. Meera, Daughter"
          />
        </label>
        <label>
          Tell us more
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What makes this moment warm and special?"
          />
        </label>
        <label style={{ margin: '10px 0 6px' }}>Choose a symbol:</label>
        <div className="answer-options" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {icons.map(icon => (
            <button
              key={icon}
              className={image === icon ? 'chosen' : ''}
              onClick={() => setImage(icon)}
            >
              {icon}
            </button>
          ))}
        </div>
        <Button
          onClick={() =>
            add({
              title: title || 'A special moment',
              description: description || 'A warm memory to keep close.',
              person: person || 'Family',
              image,
            })
          }
        >
          Save memory <Check size={17} />
        </Button>
      </div>
    </div>
  );
}

function ReminderModal({ close, add, t }: any) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [kind, setKind] = useState('Daily care');
  const [icon, setIcon] = useState('💧');
  const icons = ['💧', '💊', '📞', '🚶', '🍎', '🍵', '🌿', '🥣'];

  return (
    <div className="modal-backdrop">
      <div className="modal form-modal">
        <button className="modal-close" onClick={close} aria-label="Close">
          <X />
        </button>
        <span className="modal-spark">{icon}</span>
        <div className="eyebrow">A GENTLE DAILY RHYTHM</div>
        <h2>{t.addReminder || 'Add a reminder'}</h2>
        <p>Set a gentle reminder for today’s schedule.</p>
        <label>
          Reminder title
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Drink a glass of warm water"
          />
        </label>
        <label>
          Scheduled time
          <input
            value={time}
            onChange={e => setTime(e.target.value)}
            placeholder="e.g. 10:00 AM or 06:30 PM"
          />
        </label>
        <label>
          Category
          <input
            value={kind}
            onChange={e => setKind(e.target.value)}
            placeholder="e.g. Health, Wellness, Family call"
          />
        </label>
        <label style={{ margin: '10px 0 6px' }}>Choose an icon:</label>
        <div className="answer-options" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {icons.map(ic => (
            <button
              key={ic}
              className={icon === ic ? 'chosen' : ''}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>
        <Button
          onClick={() =>
            add({
              title: title || 'Daily reminder',
              time: time || '12:00 PM',
              icon,
              kind: kind || 'Daily care',
            })
          }
        >
          Save reminder <Check size={17} />
        </Button>
      </div>
    </div>
  );
}

function CallModal({ patient, close, notify }: any) {
  const [calling, setCalling] = useState(false);

  const startCall = () => {
    setCalling(true);
    setTimeout(() => {
      setCalling(false);
      close();
      notify('Call connected with Meera. Hope you have a wonderful chat!');
    }, 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: '420px' }}>
        <button className="modal-close" onClick={close} aria-label="Close">
          <X />
        </button>
        <div className="patient-avatar" style={{ margin: '0 auto 16px', width: '64px', height: '64px', fontSize: '20px' }}>
          MP
        </div>
        <div className="eyebrow">DIRECT FAMILY CONTACT</div>
        <h2>Call Meera Patil</h2>
        <p>Your daughter Meera is ready to chat anytime.</p>
        <p style={{ fontWeight: 600, color: '#2e6458', margin: '8px 0 20px', fontSize: '15px' }}>
          {patient?.phone || '+91 98230 12345'}
        </p>

        {calling ? (
          <div style={{ padding: '16px', background: '#e4f1ea', borderRadius: '12px', color: '#2e6458', fontWeight: 600 }}>
            Connecting call to Meera...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button onClick={startCall}>
              <Phone size={18} /> Start Call Now
            </Button>
            <Button variant="outline" onClick={close}>
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function GameplayModal({
  activity,
  close,
  complete,
}: {
  activity: ApiActivity;
  close: () => void;
  complete: (score: number) => void;
}) {
  const [stage, setStage] = useState<'intro' | 'preview' | 'play' | 'done'>('intro');
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);

  const [cards, setCards] = useState<{ id: string; value: string; matched: boolean }[]>([]);
  const [chosenCards, setChosenCards] = useState<string[]>([]);
  const [flips, setFlips] = useState(0);

  const [rounds, setRounds] = useState<string[][]>([]);
  const [round, setRound] = useState(0);
  const [sequencePhase, setSequencePhase] = useState<'show' | 'input'>('show');
  const [sequenceInput, setSequenceInput] = useState<string[]>([]);
  const [sequenceOptions, setSequenceOptions] = useState<string[]>([]);

  const [shownWords, setShownWords] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const [objects, setObjects] = useState<{ label: string; icon: string; options: string[] }[]>([]);
  const [objectIndex, setObjectIndex] = useState(0);
  const [objectOptions, setObjectOptions] = useState<string[]>([]);
  const [objectCorrect, setObjectCorrect] = useState(0);

  const [questions, setQuestions] = useState<any[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionOptions, setQuestionOptions] = useState<any[]>([]);
  const [questionCorrect, setQuestionCorrect] = useState(0);

  const data = activity?.gameData || {};
  const type = activity?.type || 'daily_orientation';
  const isCardGame = type === 'memory_match' || type === 'card_flip_memory';

  const finish = (value: number) => {
    setScore(Math.max(60, Math.min(100, Math.round(value))));
    setStage('done');
  };

  useEffect(() => {
    if (stage !== 'preview') return;
    const duration = type === 'word_recall' ? 4 : 3;
    setSeconds(duration);
    const interval = window.setInterval(() => setSeconds(v => Math.max(0, v - 1)), 1000);
    const timeout = window.setTimeout(() => setStage('play'), duration * 1000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [stage, type]);

  useEffect(() => {
    if (stage !== 'play' || type !== 'sequence_recall') return;
    const currentSeq = rounds[round] || [];
    setSequencePhase('show');
    setSequenceInput([]);
    setSeconds(6);

    const showTimer = window.setTimeout(() => {
      setSequencePhase('input');
    }, Math.max(1200, currentSeq.length * 800 + 400));

    const countdown = window.setInterval(() => setSeconds(v => Math.max(0, v - 1)), 1000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearInterval(countdown);
    };
  }, [stage, type, round, rounds]);

  const start = () => {
    if (isCardGame) {
      const rawPairs: string[] = data.pairs || ['🪔 Diya', '🥭 Mango', '🧺 Basket'];
      const pairCount = type === 'card_flip_memory' ? Math.min(4, rawPairs.length) : Math.min(3, rawPairs.length);
      const chosenPairs = fisherYates(rawPairs).slice(0, pairCount);
      const generatedCards = fisherYates(
        chosenPairs.flatMap((value, index) => [
          { id: `${index}-a`, value, matched: false },
          { id: `${index}-b`, value, matched: false },
        ])
      );
      setCards(generatedCards);
      setChosenCards([]);
      setFlips(0);
      setStage(type === 'memory_match' ? 'preview' : 'play');
      return;
    }

    if (type === 'word_recall') {
      const rawWords: string[] = data.words || ['Rice', 'Mango', 'Chai', 'Flowers'];
      const decoys: string[] = data.decoys || ['Train', 'Umbrella', 'Cricket', 'Book'];
      const wordsToRemember = fisherYates(rawWords).slice(0, 3);
      setShownWords(wordsToRemember);
      setWordOptions(fisherYates([...wordsToRemember, ...decoys.slice(0, 3)]));
      setSelectedWords([]);
      setStage('preview');
      return;
    }

    if (type === 'sequence_recall') {
      const rawRounds: any[][] = data.rounds || [
        ['💧 Water', '🔥 Heat'],
        ['💧 Water', '🔥 Heat', '🍵 Tea'],
      ];
      const prepared = rawRounds.map(r => r.map(String));
      setRounds(prepared);
      setRound(0);
      setSequenceOptions(fisherYates(prepared[0] || []));
      setStage('play');
      return;
    }

    if (type === 'object_recognition') {
      const rawObjects: { label: string; icon: string; options: string[] }[] = data.objects || [
        { label: 'Diya', icon: '🪔', options: ['🪔 Diya', '📻 Radio', '☂️ Umbrella'] },
      ];
      const preparedObjects = fisherYates(rawObjects);
      setObjects(preparedObjects);
      setObjectIndex(0);
      setObjectCorrect(0);
      setObjectOptions(fisherYates(preparedObjects[0]?.options || []));
      setStage('preview');
      return;
    }

    // Daily orientation or light math
    const rawQuestions: any[] = data.questions || [
      { question: 'What meal do we eat in the morning?', options: ['Breakfast', 'Dinner', 'Snack'], answer: 'Breakfast' },
    ];
    const preparedQuestions = fisherYates(rawQuestions);
    setQuestions(preparedQuestions);
    setQuestionIndex(0);
    setQuestionCorrect(0);
    setQuestionOptions(fisherYates((preparedQuestions[0] as any)?.options || []));
    setStage('play');
  };

  const chooseCard = (id: string) => {
    if (chosenCards.includes(id) || chosenCards.length === 2 || cards.find(c => c.id === id)?.matched) return;
    const next = [...chosenCards, id];
    setChosenCards(next);
    setFlips(f => f + 1);

    if (next.length === 2) {
      const card1 = cards.find(c => c.id === next[0]);
      const card2 = cards.find(c => c.id === next[1]);

      if (card1 && card2 && card1.value === card2.value) {
        const updated = cards.map(c => (next.includes(c.id) ? { ...c, matched: true } : c));
        setCards(updated);
        setChosenCards([]);
        if (updated.every(c => c.matched)) {
          finish(100);
        }
      } else {
        setTimeout(() => setChosenCards([]), 700);
      }
    }
  };

  const chooseSequence = (val: string) => {
    const currentSeq = rounds[round] || [];
    const pos = sequenceInput.length;

    if (val !== currentSeq[pos]) {
      // Gentle restart of current round
      setSequenceInput([]);
      return;
    }

    const next = [...sequenceInput, val];
    setSequenceInput(next);

    if (next.length === currentSeq.length) {
      if (round + 1 === rounds.length) {
        finish(100);
      } else {
        const nextRound = round + 1;
        setRound(nextRound);
        setSequenceOptions(fisherYates(rounds[nextRound] || []));
      }
    }
  };

  const chooseObject = (option: string) => {
    const current = objects[objectIndex];
    const isRight = option.includes(current.label);
    const newCorrect = isRight ? objectCorrect + 1 : objectCorrect;

    if (objectIndex + 1 === objects.length) {
      finish(Math.round((newCorrect / Math.max(1, objects.length)) * 100));
    } else {
      const nextIdx = objectIndex + 1;
      setObjectCorrect(newCorrect);
      setObjectIndex(nextIdx);
      setObjectOptions(fisherYates(objects[nextIdx].options || []));
    }
  };

  const chooseQuestion = (option: any) => {
    const current = questions[questionIndex];
    const isRight = String(option) === String(current.answer);
    const newCorrect = isRight ? questionCorrect + 1 : questionCorrect;

    if (questionIndex + 1 === questions.length) {
      finish(Math.round((newCorrect / Math.max(1, questions.length)) * 100));
    } else {
      const nextIdx = questionIndex + 1;
      setQuestionCorrect(newCorrect);
      setQuestionIndex(nextIdx);
      setQuestionOptions(fisherYates(questions[nextIdx].options || []));
    }
  };

  const instruction =
    type === 'card_flip_memory'
      ? 'Turn over two cards at a time. Matching cards stay open.'
      : type === 'light_math'
      ? 'Take your time with each simple sum.'
      : type === 'memory_match'
      ? 'Remember the pairs, then tap each matching pair.'
      : type === 'sequence_recall'
      ? 'Watch the sequence and tap it back in the same order.'
      : type === 'word_recall'
      ? 'Remember the words, then select the ones you saw.'
      : type === 'object_recognition'
      ? 'Look carefully, then choose each familiar object.'
      : 'Answer a few gentle questions about everyday life.';

  return (
    <div className="modal-backdrop">
      <div className="modal activity-modal">
        <button className="modal-close" onClick={close} aria-label="Close">
          <X />
        </button>

        {stage === 'intro' && (
          <>
            <span className="modal-spark">{activity.icon}</span>
            <div className="eyebrow">
              {activity.category} · {activity.difficulty}
            </div>
            <h2>{activity.title}</h2>
            <p>{instruction}</p>
            <div className="activity-instruction">There is no hurry. Do your best.</div>
            <Button onClick={start}>
              I’m ready <ChevronRight size={17} />
            </Button>
          </>
        )}

        {stage === 'preview' && (
          <>
            <span className="modal-spark">👀</span>
            <div className="eyebrow">LOOK AND REMEMBER</div>
            <h2>Take a moment</h2>
            <p>These will be hidden in {seconds} seconds.</p>
            <div className="answer-options">
              {type === 'memory_match'
                ? cards.map(c => <button key={c.id} disabled>{c.value}</button>)
                : type === 'word_recall'
                ? shownWords.map(w => <button key={w} disabled>{w}</button>)
                : objects.map(o => (
                    <button key={o.label} disabled>
                      {o.icon} {o.label}
                    </button>
                  ))}
            </div>
          </>
        )}

        {stage === 'play' && isCardGame && (
          <>
            <div className="eyebrow">
              {type === 'card_flip_memory'
                ? `CARD FLIPS · ${flips}`
                : `PAIRS FOUND · ${cards.filter(c => c.matched).length / 2}`}
            </div>
            <h2>Find the matching pairs</h2>
            <div className="answer-options" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {cards.map(card => {
                const isShown = card.matched || chosenCards.includes(card.id);
                return (
                  <button
                    key={card.id}
                    className={isShown ? 'chosen' : ''}
                    onClick={() => chooseCard(card.id)}
                    style={{ minHeight: '68px', fontSize: isShown ? '16px' : '22px' }}
                  >
                    {isShown ? card.value : '❓'}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {stage === 'play' && type === 'sequence_recall' && (
          <>
            <div className="eyebrow">
              ROUND {round + 1} OF {rounds.length}
            </div>
            <h2>{sequencePhase === 'show' ? 'Watch the sequence' : 'Tap it back in order'}</h2>
            <p>
              {sequencePhase === 'show'
                ? (rounds[round] || []).join('  ➔  ')
                : 'Choose each item in the same order.'}
            </p>
            {sequencePhase === 'input' && (
              <div className="answer-options">
                {sequenceOptions.map(item => (
                  <button key={item} onClick={() => chooseSequence(item)}>
                    {item}
                  </button>
                ))}
              </div>
            )}
            {sequenceInput.length > 0 && sequencePhase === 'input' && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#2e6458', fontWeight: 600 }}>
                Selected: {sequenceInput.join(' ➔ ')}
              </div>
            )}
          </>
        )}

        {stage === 'play' && type === 'word_recall' && (
          <>
            <div className="eyebrow">WORD RECALL</div>
            <h2>Which words did you see?</h2>
            <p>Tap all the words you remember seeing.</p>
            <div className="answer-options">
              {wordOptions.map(w => (
                <button
                  key={w}
                  className={selectedWords.includes(w) ? 'chosen' : ''}
                  onClick={() =>
                    setSelectedWords(prev =>
                      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
                    )
                  }
                >
                  {w}
                </button>
              ))}
            </div>
            <Button
              onClick={() => {
                const correctCount = selectedWords.filter(w => shownWords.includes(w)).length;
                finish(Math.round((correctCount / Math.max(1, shownWords.length)) * 100));
              }}
              style={{ marginTop: '18px' }}
            >
              Check my answers <Check size={17} />
            </Button>
          </>
        )}

        {stage === 'play' && type === 'object_recognition' && objects[objectIndex] && (
          <>
            <div className="eyebrow">
              OBJECT {objectIndex + 1} OF {objects.length}
            </div>
            <h2>Which familiar object is this?</h2>
            <div className="activity-instruction" style={{ fontSize: '48px', padding: '16px' }}>
              {objects[objectIndex].icon}
            </div>
            <div className="answer-options">
              {objectOptions.map(opt => (
                <button key={opt} onClick={() => chooseObject(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'play' && (type === 'daily_orientation' || type === 'light_math') && questions[questionIndex] && (
          <>
            <div className="eyebrow">
              QUESTION {questionIndex + 1} OF {questions.length}
            </div>
            <h2>{questions[questionIndex].question || questions[questionIndex].prompt}</h2>
            <div className="answer-options">
              {questionOptions.map(opt => (
                <button key={String(opt)} onClick={() => chooseQuestion(opt)}>
                  {String(opt)}
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'done' && (
          <>
            <span className="modal-spark">🌟</span>
            <div className="eyebrow">ACTIVITY COMPLETE</div>
            <h2>That was wonderful!</h2>
            <p>You scored {score}%. Every thoughtful effort keeps your mind bright.</p>
            <Button onClick={() => complete(score)}>
              Save my progress <Check size={17} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
