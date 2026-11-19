
import { useState, useCallback } from 'react'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [pagina, setPagina] = useState('inicio')
  const [sessao, setSessao] = useState(null)

  // Executado quando o login é realizado
  function handleLogin(dados) {
    setSessao(dados)
    setPagina('dashboard')
  }

  // Encerrar a sessão do usuário
  const handleLogout = useCallback(() => {
    setSessao(null)
    setPagina('login')
  }, [])

  // Página do Dashboard
  if (pagina === 'dashboard' && sessao) {
    return (
      <Dashboard
        usuario={sessao.usuario}
        token={sessao.token}
        aoSair={handleLogout}
      />
    )
  }

  // Página de Login
  if (pagina === 'login') {
    return (
      <Login
        irParaCadastro={() => setPagina('cadastro')}
        aoLogar={handleLogin}
      />
    )
  }

  // Página de Cadastro
  if (pagina === 'cadastro') {
    return (
      <Cadastro
        irParaLogin={() => setPagina('login')}
      />
    )
  }

  // Página inicial
  return (
    <main className="app">
      <h1>TaskFlow</h1>
      <p>Seu gerenciador de tarefas</p>

      <h2>Bem-vindo ao TaskFlow!</h2>
      <p>Organize suas tarefas de forma simples e eficiente.</p>

      <button
        type="button"
        onClick={() => setPagina('login')}
      >
        Começar
      </button>
    </main>
  )
}

export default App
