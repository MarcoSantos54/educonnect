import React, { useState } from 'react';

const PortalEduConnect = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fakeLogin = () => {
    // Simular login validado
    if(email && senha) {
      setUser({
        nome: 'João da Silva',
        serie: '9º Ano',
        turma: 'Turma A',
        email,
        telefone: '(11) 98765-4321',
        nascimento: '15/09/2006',
        aulasHoje: [
          { horario: '07:30', materia: 'Matemática', professor: 'Prof. Maria Silva' },
          { horario: '08:30', materia: 'Português', professor: 'Prof. João Costa' },
          { horario: '09:30', materia: 'História', professor: 'Prof. Ana Santos' },
          { horario: '10:45', materia: 'Educação Física', professor: 'Prof. Carlos Lima' },
        ],
        atividadesConcluidas: 12,
        sequenciaDias: 7,
        professores: [
          { nome: 'Maria Silva', disciplina: 'Matemática' },
          { nome: 'João Costa', disciplina: 'Português' },
          { nome: 'Ana Santos', disciplina: 'História' },
          { nome: 'Carlos Lima', disciplina: 'Educação Física' },
        ],
        jogosEducativos: [
          { titulo: 'Quiz de Matemática', sequencia: 5 },
          { titulo: 'Desafio de História', sequencia: 3 },
          { titulo: 'Quiz de Ciências', sequencia: 7 },
        ],
      });
    }
  };

  if(!user) {
    // Tela de Login
    return (
      <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', background: '#677eff', height: '100vh', color: '#fff' }}>
        <div style={{ maxWidth: 400, margin: 'auto', background: 'white', borderRadius: 20, padding: 20, color: '#333' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 24 }}>EduConnect</div>
            <div style={{ fontSize: 14, marginBottom: 10 }}>Portal do Aluno</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              Bem-vindo! Faça login para acessar suas atividades e recursos escolares.
            </div>
          </div>

          <h2 style={{ textAlign: 'center' }}>Entrar</h2>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#888' }}>Acesse sua conta estudantil</p>

          <input 
            type="email" 
            placeholder="seu.email@escola.edu.br" 
            style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 10, border: '1px solid #ddd' }} 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Sua senha"
            style={{ width: '100%', padding: 10, marginBottom: 20, borderRadius: 10, border: '1px solid #ddd' }}
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <button 
            style={{ 
              width: '100%', 
              padding: 12, 
              background: 'linear-gradient(90deg, #4568dc, #b06ab3)', 
              color: 'white', 
              fontWeight: 'bold', 
              borderRadius: 10, 
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={fakeLogin}
          >
            🎓 Acessar Portal 🚀
          </button>
        </div>
      </div>
    );
  }

  // Tela do Painel do Aluno
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto', padding: 20 }}>
      <header style={{ background: 'linear-gradient(90deg, #5a58fc, #a56eff)', color: 'white', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <h2>{user.nome}</h2>
        <p>{user.serie} - {user.turma}</p>
      </header>

      <section style={{ background: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <h3>Aulas de Hoje</h3>
        {user.aulasHoje.map((aula, i) => (
          <div 
            key={i} 
            style={{ background: '#eee', borderRadius: 12, padding: 10, marginTop: 10 }}
          >
            <p><strong>Horário</strong> {aula.horario}</p>
            <p><strong>{aula.materia}</strong></p>
            <p style={{ color: '#666' }}>Prof. {aula.professor}</p>
          </div>
        ))}
      </section>

      <section style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{
          flex: 1,
          background: '#4CAF50',
          color: 'white',
          borderRadius: 12,
          marginRight: 10,
          padding: 20,
          textAlign: 'center',
        }}>
          <h2>{user.atividadesConcluidas}</h2>
          Atividades Concluídas
        </div>
        <div style={{
          flex: 1,
          background: '#FF9800',
          color: 'white',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
        }}>
          <h2>{user.sequenciaDias}</h2>
          Dias de Sequência 🔥
        </div>
      </section>

      <section style={{ background: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <h3>Meus Professores</h3>
        {user.professores.map((prof, i) => (
          <div key={i} style={{ background: '#eee', borderRadius: 12, padding: 10, marginTop: 10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <p style={{ fontWeight: 'bold' }}>Prof. {prof.nome}</p>
              <p style={{ color: '#666' }}>{prof.disciplina}</p>
            </div>
            <button style={{ padding: '6px 12px', borderRadius: 10, border: 'none', background: '#ccc', cursor: 'pointer' }}>Mensagem</button>
          </div>
        ))}
      </section>

      <section style={{ background: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <h3>Minijogos Educativos</h3>
        {user.jogosEducativos.map((jogo, i) => (
          <div key={i} style={{ background: '#baaaff', borderRadius: 12, padding: 15, marginTop: 10, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
            <div>
              <h4>{jogo.titulo}</h4>
              <p>Sequência: {jogo.sequencia} dias 🔥</p>
            </div>
            <button style={{background:'#7e57c2', border:'none', color:'white', padding:'8px 16px', borderRadius: 12, cursor: 'pointer'}}>Jogar</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PortalEduConnect;