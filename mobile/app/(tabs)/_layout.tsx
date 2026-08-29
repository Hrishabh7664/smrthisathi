import { Tabs } from 'expo-router';
import { Home, Brain, BookOpen, Bell, UserRound } from 'lucide-react-native';
const items=[['index','Home',Home],['activities','Activities',Brain],['memories','Memories',BookOpen],['reminders','Reminders',Bell],['profile','Profile',UserRound]] as const;
export default function TabsLayout(){ return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:'#2E6458',tabBarInactiveTintColor:'#91A099',tabBarStyle:{height:74,paddingBottom:12,paddingTop:8,borderTopColor:'#E5E9E2',backgroundColor:'#fff'},tabBarLabelStyle:{fontSize:11,fontWeight:'600'}}}>{items.map(([name,label,Icon])=><Tabs.Screen key={name} name={name} options={{title:label,tabBarIcon:({color})=><Icon size={22} color={color}/>}} />)}</Tabs>; }
