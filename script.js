const MOCK_USER = { name: "Aluno Exemplo", email: "aluno@escola.com" };
const MOCK_ACTIVITIES = [
  { id: "a1", title: "Exercício 1 - Frações", subject: "Matemática", due: "2025-11-02", status: "Pendente" },
  { id: "a2", title: "Redação: Meu Lugar Favorito", subject: "Português", due: "2025-11-05", status: "Em andamento" },
  { id: "a3", title: "Experimento - Plantas", subject: "Ciências", due: "2025-11-07", status: "Pendente" },
  { id: "a4", title: "Lista de Álgebra", subject: "Matemática", due: "2025-10-30", status: "Concluída" },
];

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(div => div.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (!email || !pass) {
    alert("E-mail e senha são obrigatórios!");
    return;
  }
  localStorage.setItem("user", JSON.stringify(MOCK_USER));
  document.getElementById("user-name").textContent = MOCK_USER.name;
  const pending = MOCK_ACTIVITIES.filter(a => a.status !== "Concluída").length;
  document.getElementById("pending-count").textContent = pending;
  showScreen("home-screen");
}

function logout() {
  localStorage.removeItem("user");
  showScreen("login-screen");
}

function showHome() {
  showScreen("home-screen");
}

function showActivities() {
  const list = document.getElementById("activities-list");
  list.innerHTML = "";
  MOCK_ACTIVITIES.forEach(a => {
    const div = document.createElement("div");
    div.className = "activity";
    div.innerHTML = `
      <h4>${a.title}</h4>
      <p>${a.subject} • Entrega: ${a.due}</p>
      <p>Status: <strong>${a.status}</strong></p>
    `;
    list.appendChild(div);
  });
  showScreen("activities-screen");
}

const chatMessages = [
  { from: "Prof. Ana", text: "Olá! Como estão os estudos?" }
];

function showChat() {
  const container = document.getElementById("chat-messages");
  container.innerHTML = "";
  chatMessages.forEach(m => {
    const div = document.createElement("div");
    div.className = `chat-message ${m.from === 'Você' ? 'chat-right' : 'chat-left'}`;
    div.innerHTML = `<strong>${m.from}</strong><br>${m.text}`;
    container.appendChild(div);
  });
  showScreen("chat-screen");
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;
  chatMessages.push({ from: "Você", text });
  input.value = "";
  showChat();
}

