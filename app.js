 App.js // React Native (Expo) single-file example app // Packages required: // expo init or create-react-native-app // yarn add @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-gesture-handler react-native-safe-area-context @react-native-async-storage/async-storage // Optional for Firebase: // yarn add firebase

import React, { useState, useEffect, useRef } from 'react'; import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert, Platform, KeyboardAvoidingView, } from 'react-native'; import AsyncStorage from '@react-native-async-storage/async-storage'; import { NavigationContainer } from '@react-navigation/native'; import { createStackNavigator } from '@react-navigation/stack'; import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// ---------- Placeholder Firebase setup (optional) ---------- // import firebase from 'firebase/app'; // import 'firebase/auth'; // import 'firebase/firestore'; // const firebaseConfig = { /* YOUR FIREBASE CONFIG HERE */ }; // if (!firebase.apps?.length) firebase.initializeApp(firebaseConfig); // const auth = firebase.auth(); // const db = firebase.firestore();

// ---------- Mock data (replace with Firestore/Firebase calls) ---------- const MOCK_USER = { name: 'Aluno Exemplo', email: 'aluno@escola.com' }; const MOCK_TEACHERS = [ { id: 't1', name: 'Prof. Ana', subject: 'Matemática' }, { id: 't2', name: 'Prof. Bruno', subject: 'Português' }, ]; const MOCK_ACTIVITIES = [ { id: 'a1', title: 'Exercício 1 - Frações', subject: 'Matemática', due: '2025-11-02', status: 'Pendente', sequence: 1 }, { id: 'a2', title: 'Redação: Meu Lugar Favorito', subject: 'Português', due: '2025-11-05', status: 'Em andamento', sequence: 1 }, { id: 'a3', title: 'Experimento - Plantas', subject: 'Ciências', due: '2025-11-07', status: 'Pendente', sequence: 2 }, { id: 'a4', title: 'Lista de Álgebra', subject: 'Matemática', due: '2025-10-30', status: 'Concluída', sequence: 2 }, ];

// ---------- Screens & Components ---------- function LoginScreen({ navigation }) { const [email, setEmail] = useState(''); const [password, setPassword] = useState('');

const handleLogin = async () => { if (!email.trim() || !password.trim()) { Alert.alert('Aviso', 'E-mail e senha são obrigatórios.'); return; }

// TODO: Replace this mock logic with Firebase Auth or your backend.
try {
  // Example Firebase sign-in:
  // await auth.signInWithEmailAndPassword(email, password);
  // const user = auth.currentUser;

  // For demo store user in AsyncStorage
  await AsyncStorage.setItem('user', JSON.stringify(MOCK_USER));
  navigation.replace('Main');
} catch (err) {
  Alert.alert('Erro', 'Falha no login. Verifique as credenciais.');
}

};

return ( <SafeAreaView style={styles.containerCenter}> <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ width: '90%' }}> <Text style={styles.logo}>EduConnect</Text> <Text style={styles.welcome}>Bem-vindo ao EduConnect!</Text>

<TextInput
      placeholder="E-mail"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      style={styles.input}
    />
    <TextInput
      placeholder="Senha"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      style={styles.input}
    />

    <TouchableOpacity onPress={() => Alert.alert('Recuperação', 'Enviar instruções para o e-mail')}>
      <Text style={styles.forgot}>Esqueceu a senha?</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Entrar</Text>
    </TouchableOpacity>
  </KeyboardAvoidingView>
</SafeAreaView>

); }

function HomeScreen({ navigation }) { const [user, setUser] = useState(null); const [activities, setActivities] = useState(MOCK_ACTIVITIES);

useEffect(() => { (async () => { const raw = await AsyncStorage.getItem('user'); if (raw) setUser(JSON.parse(raw)); })(); }, []);

const pendingCount = activities.filter(a => a.status !== 'Concluída').length; const lastMessages = [ { id: 'm1', from: 'Prof. Ana', text: 'Lembrem-se da atividade de Frações.' }, ];

return ( <SafeAreaView style={styles.container}> <View style={styles.topBar}> <Text style={styles.logoSmall}>EduConnect</Text> <TouchableOpacity onPress={() => navigation.navigate('Settings')}> <Image source={{ uri: 'https://placehold.co/40x40' }} style={styles.avatar} /> </TouchableOpacity> </View>

<View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>Atividades Pendentes</Text>
    <Text style={styles.summaryNumber}>{pendingCount}</Text>
    <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Activities')}>
      <Text>Ver minhas atividades</Text>
    </TouchableOpacity>
  </View>

  <View style={{ padding: 16 }}>
    <Text style={{ fontWeight: '700' }}>Últimas mensagens</Text>
    {lastMessages.map(m => (
      <View key={m.id} style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: '600' }}>{m.from}</Text>
        <Text>{m.text}</Text>
      </View>
    ))}
  </View>
</SafeAreaView>

); }

function ActivitiesScreen({ navigation }) { const [filter, setFilter] = useState('all'); // all, completed, pending const [activities, setActivities] = useState(MOCK_ACTIVITIES);

// Sort by sequence then due date const sorted = [...activities].sort((a, b) => a.sequence - b.sequence || a.due.localeCompare(b.due));

const filtered = sorted.filter(a => { if (filter === 'completed') return a.status === 'Concluída'; if (filter === 'pending') return a.status !== 'Concluída'; return true; });

const renderItem = ({ item }) => ( <TouchableOpacity style={styles.activityItem} onPress={() => navigation.navigate('ActivityDetails', { activity: item })}> <View> <Text style={styles.activityTitle}>{item.title}</Text> <Text style={styles.activityMeta}>{item.subject} • Entrega: {item.due}</Text> </View> <Text style={[styles.statusBadge, item.status === 'Concluída' ? styles.statusDone : styles.statusPending]}>{item.status}</Text> </TouchableOpacity> );

return ( <SafeAreaView style={styles.container}> <View style={styles.filtersRow}> <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filterButton, filter === 'all' && styles.filterActive]}> <Text>📅 Todas</Text> </TouchableOpacity> <TouchableOpacity onPress={() => setFilter('pending')} style={[styles.filterButton, filter === 'pending' && styles.filterActive]}> <Text>⏳ Pendentes</Text> </TouchableOpacity> <TouchableOpacity onPress={() => setFilter('completed')} style={[styles.filterButton, filter === 'completed' && styles.filterActive]}> <Text>✅ Concluídas</Text> </TouchableOpacity> </View>

<FlatList data={filtered} keyExtractor={i => i.id} renderItem={renderItem} contentContainerStyle={{ padding: 16 }} />
</SafeAreaView>

); }

function ActivityDetailsScreen({ route, navigation }) { const { activity } = route.params; const [status, setStatus] = useState(activity.status);

const markDone = () => { // In real app update backend setStatus('Concluída'); Alert.alert('Sucesso', 'Atividade marcada como concluída.'); };

return ( <SafeAreaView style={styles.container}> <View style={{ padding: 16 }}> <Text style={styles.activityTitle}>{activity.title}</Text> <Text style={{ marginTop: 8 }}>{activity.subject} • Entrega: {activity.due}</Text> <Text style={{ marginTop: 12, fontWeight: '700' }}>Status: {status}</Text>

<TouchableOpacity onPress={markDone} style={[styles.button, { marginTop: 20 }]}>
      <Text style={styles.buttonText}>Marcar como concluída</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>

); }

function ChatListScreen({ navigation }) { const [teachers] = useState(MOCK_TEACHERS);

return ( <SafeAreaView style={styles.container}> <FlatList data={teachers} keyExtractor={t => t.id} renderItem={({ item }) => ( <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('Chat', { teacher: item })}> <View> <Text style={{ fontWeight: '700' }}>{item.name}</Text> <Text>{item.subject}</Text> </View> </TouchableOpacity> )} contentContainerStyle={{ padding: 16 }} /> </SafeAreaView> ); }

function ChatScreen({ route }) { const { teacher } = route.params; const [messages, setMessages] = useState([ { id: 'm1', from: teacher.name, text: 'Olá! Como estão os estudos?', time: '10:00' }, ]); const [text, setText] = useState('');

const send = () => { if (!text.trim()) return; const m = { id: m${Date.now()}, from: 'Você', text: text.trim(), time: new Date().toLocaleTimeString() }; setMessages(prev => [...prev, m]); setText('');

// TODO: Push message to backend (Realtime DB / Firestore)

};

return ( <SafeAreaView style={styles.container}> <View style={{ padding: 16, flex: 1 }}> <Text style={{ fontWeight: '700', marginBottom: 8 }}>{teacher.name} • {teacher.subject}</Text>

<FlatList
      data={messages}
      keyExtractor={m => m.id}
      renderItem={({ item }) => (
        <View style={[styles.chatBubble, item.from === 'Você' ? styles.chatRight : styles.chatLeft]}>
          <Text style={{ fontWeight: '600' }}>{item.from}</Text>
          <Text>{item.text}</Text>
          <Text style={{ fontSize: 10, marginTop: 6 }}>{item.time}</Text>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
    />

    <View style={styles.chatInputRow}>
      <TextInput value={text} onChangeText={setText} placeholder="Escreva uma mensagem" style={styles.chatInput} />
      <TouchableOpacity style={styles.sendButton} onPress={send}>
        <Text style={{ color: '#fff' }}>Enviar</Text>
      </TouchableOpacity>   </View>
  </View>
</SafeAreaView>

); }

function PendingScreen({ navigation }) { const [activities, setActivities] = useState(MOCK_ACTIVITIES.filter(a => a.status !== 'Concluída'));

const markDone = id => { setActivities(prev => prev.map(a => (a.id === id ? { ...a, status: 'Concluída' } : a))); Alert.alert('Sucesso', 'Atividade marcada como concluída.'); };

return ( <SafeAreaView style={styles.container}> <FlatList data={activities} keyExtractor={i => i.id} renderItem={({ item }) => ( <View style={styles.pendingItem}> <View> <Text style={styles.activityTitle}>{item.title}</Text> <Text>{item.subject} • Entrega: {item.due}</Text> </View> <TouchableOpacity style={[styles.buttonSmall]} onPress={() => markDone(item.id)}> <Text style={{ color: '#fff' }}>Marcar como concluída</Text> </TouchableOpacity> </View> )} contentContainerStyle={{ padding: 16 }} /> </SafeAreaView> ); }

function SettingsScreen() { return ( <SafeAreaView style={styles.container}> <View style={{ padding: 16 }}> <Text style={{ fontWeight: '700' }}>Perfil do aluno</Text> <Text>Nome: {MOCK_USER.name}</Text> <Text>E-mail: {MOCK_USER.email}</Text> <Text>Turma: 9ºA (exemplo)</Text>

<View style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: '700' }}>Aparência</Text>
      <Text>Modo Escuro (opcional)</Text>
    </View>
  </View>
</SafeAreaView>

); }

// ---------- Navigation setup ---------- const Stack = createStackNavigator(); const Tab = createBottomTabNavigator();

function MainTabs() { return ( <Tab.Navigator screenOptions={{ headerShown: false }}> <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} /> <Tab.Screen name="Activities" component={ActivitiesScreen} options={{ title: 'Atividades' }} /> <Tab.Screen name="Chats" component={ChatListScreen} options={{ title: 'Conversas' }} /> <Tab.Screen name="Pending" component={PendingScreen} options={{ title: 'Pendentes' }} /> <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} /> </Tab.Navigator> ); }

export default function App() { return ( <NavigationContainer> <Stack.Navigator screenOptions={{ headerShown: false }}> <Stack.Screen name="Login" component={LoginScreen} /> <Stack.Screen name="Main" component={MainTabs} /> <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} /> <Stack.Screen name="Chat" component={ChatScreen} /> </Stack.Navigator> </NavigationContainer> ); }

// ---------- Styles ---------- const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, containerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }, logo: { fontSize: 40, fontWeight: '900', color: '#1e6fb3', textAlign: 'center', marginBottom: 8 }, logoSmall: { fontSize: 20, fontWeight: '800', color: '#1e6fb3' }, welcome: { textAlign: 'center', marginBottom: 16 }, input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fafafa' }, forgot: { color: '#1e6fb3', textAlign: 'right', marginBottom: 16 }, button: { backgroundColor: '#1e6fb3', padding: 12, borderRadius: 8, alignItems: 'center' }, buttonSmall: { backgroundColor: '#1e6fb3', padding: 8, borderRadius: 6 }, buttonText: { color: '#fff', fontWeight: '700' }, topBar: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, avatar: { width: 40, height: 40, borderRadius: 20 }, summaryCard: { margin: 16, padding: 16, borderRadius: 12, backgroundColor: '#f3f9ff' }, summaryTitle: { fontWeight: '700' }, summaryNumber: { fontSize: 28, fontWeight: '900', marginTop: 6 }, linkButton: { marginTop: 8 }, filtersRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 12 }, filterButton: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#eee' }, filterActive: { backgroundColor: '#e6f2ff' }, activityItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, marginBottom: 12, borderRadius: 8, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 }, activityTitle: { fontWeight: '700' }, activityMeta: { color: '#666' }, statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, fontWeight: '700' }, statusDone: { backgroundColor: '#e6ffef', color: '#0a8a3a' }, statusPending: { backgroundColor: '#fff3f3', color: '#d13434' }, chatItem: { padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }, chatBubble: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: '80%' }, chatLeft: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1' }, chatRight: { alignSelf: 'flex-end', backgroundColor: '#1e6fb3', color: '#fff' }, chatInputRow: { position: 'absolute', left: 16, right: 16, bottom: 24, flexDirection: 'row', alignItems: 'center' }, chatInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginRight: 8, backgroundColor: '#fff' }, sendButton: { backgroundColor: '#1e6fb3', padding: 10, borderRadius: 8 }, pendingItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }, });