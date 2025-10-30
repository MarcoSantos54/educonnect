// Mock data
const MOCK_USER = { name: 'Aluno Exemplo', email: 'aluno@escola.com' };
const MOCK_ACTIVITIES = [
    { id: 'a1', title: 'Exercício 1 - Frações', subject: 'Matemática', due: '2025-11-02', status: 'Pendente', sequence: 1 },
    { id: 'a2', title: 'Redação: Meu Lugar Favorito', subject: 'Português', due: '2025-11-05', status: 'Em andamento', sequence: 1 },
    { id: 'a3', title: 'Experimento - Plantas', subject: 'Ciências', due: '2025-11-07', status: 'Pendente', sequence: 2 },
    { id: 'a4', title: 'Lista de Álgebra', subject: 'Matemática', due: '2025-10-30', status: 'Concluída', sequence: 2 },
];
const MOCK_TEACHERS = [
    { id: 't1', name: 'Prof. Ana', subject: 'Matemática' },
    { id: 't2', name: 'Prof. Bruno', subject: 'Português' },
];
const MOCK_GALLERY = [
    { id: 'g1', title: 'Meu Projeto de Matemática', image: 'https://placehold.co/200x150', date: '2025-10-25' },
    { id: 'g2', title: 'Redação Final', image: 'https://placehold.co/200x150', date: '2025-10-20' },
];
const MOCK_HISTORY = [
    { id: 'h1', type: 'Atividade', title: 'Exercício 1 - Frações', date: '2025-10-30', status: 'Concluída' },
    { id: 'h2', type: 'Mensagem', title: 'Chat com Prof. Ana', date: '2025-10-28', status: 'Enviada' },
];
const MOCK_TIPS = [
    { id: 'mt1', title: 'Respiração Profunda', description: 'Pratique respiração 4-7-8 para relaxar.' },
    { id: 'mt2', title: 'Diário de Gratidão', description: 'Anote 3 coisas pelas quais você é grato todos os dias.' },
];

// Global variables
let currentUser = null;
let currentActivities = [...MOCK_ACTIVITIES];
let currentSequence = [1, 2, 3, 4];
let userSequence = [];
let level = 1;
let gameOver = false;
let currentTeacher = null;
let messages = [];

// DOM elements
const loginScreen = document.getElementById('login');
const mainScreen = document.getElementById('main');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const activityModal = document.getElementById('activity-modal');
const chatModal = document.getElementById('chat-modal');

// Login
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email && password) {
        currentUser = MOCK_USER;
        loginScreen.classList.remove('active');
        mainScreen.classList.add('active');
        loadHome();
    } else {
        alert('E-mail e senha são obrigatórios.');
    }
});

// Tab navigation
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
        if (tab.dataset.tab === 'home') loadHome();
        if (tab.dataset.tab === 'activities') loadActivities();
        if (tab.dataset.tab === 'chats') loadChats();
        if (tab.dataset.tab === 'pending') loadPending();