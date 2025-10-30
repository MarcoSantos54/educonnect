// App.js // React Native (Expo) single-file example app // Packages required: // expo init or create-react-native-app // yarn add @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-gesture-handler react-native-safe-area-context @react-native-async-storage/async-storage // Optional for Firebase: // yarn add firebase

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView, Modal, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// ---------- Placeholder Firebase setup (optional) ---------- // import firebase from 'firebase/app'; // import 'firebase/auth'; // import 'firebase/firestore'; // const firebaseConfig = { /* YOUR FIREBASE CONFIG HERE */ }; // if (!firebase.apps?.length) firebase.initializeApp(firebaseConfig); // const auth = firebase.auth(); // const db = firebase.firestore();

// ---------- Mock data (replace with Firestore/Firebase calls) ---------- const MOCK_USER = { name: 'Aluno Exemplo', email: 'aluno@escola.com' }; const MOCK_TEACHERS = [ { id: 't1', name: 'Prof. Ana', subject: 'Matemática' }, { id: 't2', name: 'Prof. Bruno', subject: 'Português' }, ]; const MOCK_ACTIVITIES = [ { id: 'a1', title: 'Exercício 1 - Frações', subject: 'Matemática', due: '2025-11-02', status: 'Pendente', sequence: 1 }, { id: 'a2', title: 'Redação: Meu Lugar Favorito', subject: 'Português', due: '2025-11-05', status: 'Em andamento', sequence: 1 }, { id: 'a3', title: 'Experimento - Plantas', subject: 'Ciências', due: '2025-11-07', status: 'Pendente', sequence: 2 }, { id: 'a4', title: 'Lista de Álgebra', subject: 'Matemática', due: '2025-10-30', status: 'Concluída', sequence: 2 }, ]; const MOCK_GALLERY = [ { id: 'g1', title: 'Meu Projeto de Matemática', image: 'https://placehold.co/200x150', date: '2025-10-25' }, { id: 'g2', title: 'Redação Final', image: 'https://placehold.co/200x150', date: '2025-10-20' }, ]; const MOCK_HISTORY = [ { id: 'h1', type: 'Atividade', title: 'Exercício 1 - Frações', date: '2025-10-30', status: 'Concluída' }, { id: 'h2', type: 'Mensagem', title: 'Chat com Prof. Ana', date: '2025-10-28', status: 'Enviada' }, ]; const MOCK_MENTAL_HEALTH_TIPS = [ { id: 'mt1', title: 'Respiração Profunda', description: 'Pratique respiração 4-7-8 para relaxar.' }, { id: 'mt2', title: 'Diário de Gratidão', description: 'Anote 3 coisas pelas quais você é grato todos os dias.' }, ];

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

const send = () => { if (!text.trim()) return; const m = { id: `m${Date.now()}`, from: 'Você', text: text.trim(), time: new Date().toLocaleTimeString() }; setMessages(prev => [...prev, m]); setText('');

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
      </TouchableOpacity>
    </View>
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
  </SafeAreaView>

); }

// ---------- New Screens for Mental Health, Minigames, Gallery, History ---------- function MentalHealthScreen() { const [tips] = useState(MOCK_MENTAL_HEALTH_TIPS); const [mood, setMood] = useState(''); const [journal, setJournal] = useState('');

const saveJournal = () => { Alert.alert('Salvo', 'Seu diário foi salvo!'); // TODO: Save to backend };

return ( <SafeAreaView style={styles.container}> <ScrollView style={{ padding: 16 }}> <Text style={styles.sectionTitle}>Saúde Mental</Text> <Text style={{ marginBottom: 16 }}>Como você está se sentindo hoje?</Text> <View style={styles.moodRow}> <TouchableOpacity onPress={() => setMood('Feliz')} style={[styles.moodButton, mood === 'Feliz' && styles.moodActive]}> <Text>😊 Feliz</Text> </TouchableOpacity> <TouchableOpacity onPress={() => setMood('Triste')} style={[styles.moodButton, mood === 'Triste' && styles.moodActive]}> <Text>😢 Triste</Text> </TouchableOpacity> <TouchableOpacity onPress={() => setMood('Ansioso')} style={[styles.moodButton, mood === 'Ansioso' && styles.moodActive]}> <Text>😰 Ansioso</Text> </TouchableOpacity> </View>

<Text style={{ marginTop: 20, fontWeight: '700' }}>Diário de Gratidão</Text> <TextInput multiline placeholder="Escreva aqui..." value={journal} onChangeText={setJournal} style={styles.journalInput} /> <TouchableOpacity style={styles.button} onPress={saveJournal}> <Text style={styles.buttonText}>Salvar Diário</Text> </TouchableOpacity>

<Text style={{ marginTop: 20, fontWeight: '700' }}>Dicas de Bem-Estar</Text> {tips.map(t => ( <View key={t.id} style={styles.tipCard}> <Text style={{ fontWeight: '600' }}>{t.title}</Text> <Text>{t.description}</Text> </View> ))} </ScrollView> </SafeAreaView> ); }

function MinigamesScreen() { const [sequence, setSequence] = useState([1, 2, 3, 4]); const [userSequence, setUserSequence] = useState([]); const [level, setLevel] = useState(1); const [gameOver, setGameOver] = useState(false);

const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];

const handlePress = (num) => { if (gameOver) return; const newSeq = [...userSequence, num]; setUserSequence(newSeq); if (newSeq.length === sequence.length) { if (JSON.stringify(newSeq) === JSON.stringify(sequence)) { Alert.alert('Parabéns!', 'Próximo nível!'); setLevel(level + 1); setSequence([...sequence, Math.floor(Math.random() * 4) + 1]); setUserSequence([]); } else { setGameOver(true); Alert.alert('Game Over', 'Tente novamente.'); setUserSequence([]); setGameOver(false); } } };

return ( <SafeAreaView style={styles.container}> <View style={{ padding: 16, alignItems: 'center' }}> <Text style={styles.sectionTitle}>Minijogo de Sequência</Text> <Text>Nível: {level}</Text> <Text>Repita a sequência: {sequence.join(' - ')}</Text> <View style={styles.gameGrid}> {colors.map((color, index) => ( <TouchableOpacity key={index} style={[styles.gameButton, { backgroundColor: color }]} onPress={() => handlePress(index + 1)}> <Text style={{ fontSize: 24 }}>{index + 1}</Text> </TouchableOpacity> ))} </View> <Text>Sua sequência: {userSequence.join(' - ')}</Text> </View> </SafeAreaView> ); }

function GalleryScreen() { const [gallery] = useState(MOCK_GALLERY);

return ( <SafeAreaView style={styles.container}> <FlatList data={gallery} keyExtractor={g => g.id} renderItem={({ item }) => ( <View style={styles.galleryItem}> <Image source={{ uri: item.image }} style={styles.galleryImage} /> <Text style={{ fontWeight: '600' }}>{item.title}</Text> <Text>{item.date}</Text> </View> )} contentContainerStyle={{ padding: 16 }} numColumns={2} /> </SafeAreaView> ); }

function HistoryScreen() { const [history] = useState(M