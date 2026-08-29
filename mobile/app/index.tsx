import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
export default function Index(){ useEffect(()=>{},[]); return <View style={s.splash}><Text style={s.mark}>✦</Text><Text style={s.name}>smrithi <Text style={s.green}>sathi</Text></Text><Text style={s.tag}>MEMORIES. MOMENTS. TOGETHER.</Text><Redirect href="/login" /></View> }
const s=StyleSheet.create({splash:{flex:1,backgroundColor:'#F8F8F5',alignItems:'center',justifyContent:'center'},mark:{backgroundColor:'#2E6458',color:'#fff',fontSize:34,padding:12,borderRadius:18},name:{fontSize:30,fontWeight:'700',color:'#243432',marginTop:18},green:{color:'#2E6458',fontWeight:'400'},tag:{fontSize:9,letterSpacing:2,color:'#9AA4A0',marginTop:5}});
