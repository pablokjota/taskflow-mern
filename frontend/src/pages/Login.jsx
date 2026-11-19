
import { useState } from 'react'
import './Login.css'

function Login({ irParaCadastro, aoLogar }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagem('')
    setCarregando(true)

    try {
      const resposta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao realizar login.')
      }

      if (!dados.token || !dados.usuario) {
        throw new Error('Resposta de autenticação inválida.')
      }

      
      aoLogar({
        token: dados.token,
        usuario: dados.usuario,
      })

    } catch (erro) {
      setMensagem(erro.message || 'Não foi possível realizar login.')
    } finally {
      setCarregando(false)
    }
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

        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {mensagem && <p role="alert">{mensagem}</p>}

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

