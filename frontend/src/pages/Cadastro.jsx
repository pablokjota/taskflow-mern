
import './Login.css'
import { useState } from 'react'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setErro('')
    setSucesso('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(
        'http://localhost:3000/api/auth/cadastro',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            email,
            senha,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.mensagem || 'Erro ao cadastrar usuário.')
        return
      }

      setSucesso('Conta criada com sucesso!')

      setNome('')
      setEmail('')
      setSenha('')
      setConfirmarSenha('')
    } catch (error) {
      console.error('Erro de conexão:', error)
      setErro('Não foi possível conectar ao servidor.')
    } finally {
      setCarregando(false)
    }
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
        {sucesso && <p role="status">{sucesso}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p>Já tem uma conta? Entre aqui.</p>
    </div>
  )
}

export default Cadastro
