
import { useState } from 'react'
import './Login.css'

function Login({ irParaCadastro }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    console.log('Formulário enviado')
  }

  return (
    <div className="login-container">
      <h2>Entrar no TaskFlow</h2>

      <p>Acesse sua conta para gerenciar suas tarefas.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          required
        />

        <button type="submit">
          Entrar
        </button>
      </form>

      <p>
        Ainda não tem uma conta?{' '}
        <button
          type="button"
          className="link-button"
          onClick={irParaCadastro}
        >
          Cadastre-se
        </button>
      </p>
    </div>
  )
}

export default Login
