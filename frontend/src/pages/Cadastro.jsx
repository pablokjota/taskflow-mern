import './Login.css'
import { useState } from 'react'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setErro('')
    console.log('Formulário de cadastro validado.')
  }

  return (
    <div className="login-container">
      <h2>Criar conta no TaskFlow</h2>
      <p>Cadastre-se para organizar suas tarefas.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Crie uma senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          minLength={8}
          required
        />

        <input
          type="password"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />

        {erro && <p role="alert">{erro}</p>}

        <button type="submit">Cadastrar</button>
      </form>

      <p>Já tem uma conta? Entre aqui.</p>
    </div>
  )
}

export default Cadastro
