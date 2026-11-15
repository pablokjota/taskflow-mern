
import { useState } from 'react'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import './App.css'

function App() {
  const [pagina, setPagina] = useState('inicio')

  if (pagina === 'login') {
    return <Login irParaCadastro={() => setPagina('cadastro')} />
  }

  if (pagina === 'cadastro') {
    return <Cadastro irParaLogin={() => setPagina('login')} />
  }

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
