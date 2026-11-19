

import { useEffect, useState } from 'react'
import './Dashboard.css'

const API_URL = 'http://localhost:3000/api/tasks'

function Dashboard({ usuario, token, aoSair }) {
  const [tarefas, setTarefas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('pendente')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [tarefaEditando, setTarefaEditando] = useState(null)
  const [tarefaExcluindo, setTarefaExcluindo] = useState(null)

  useEffect(() => {
    let ativo = true

    async function carregarTarefas() {
      try {
        const resposta = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (resposta.status === 401) {
          if (ativo) aoSair()
          return
        }

        if (!resposta.ok) {
          throw new Error('Erro ao carregar tarefas.')
        }

        const dados = await resposta.json()

        if (ativo) setTarefas(dados)
      } catch (erro) {
        if (ativo) {
          setMensagem(
            erro.message || 'Erro ao carregar tarefas.'
          )
        }
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregarTarefas()

    return () => {
      ativo = false
    }
  }, [token, aoSair])

  function formatarStatus(valor) {
    const nomes = {
      pendente: 'Pendente',
      'em andamento': 'Em andamento',
      concluida: 'Concluída',
    }

    return nomes[valor] || valor
  }

  function iniciarEdicao(tarefa) {
    setTarefaEditando(tarefa._id)
    setTitulo(tarefa.titulo)
    setDescricao(tarefa.descricao || '')
    setStatus(tarefa.status)
    setMensagem('')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicao() {
    setTarefaEditando(null)
    setTitulo('')
    setDescricao('')
    setStatus('pendente')
    setMensagem('')
  }

  async function salvarTarefa(event) {
    event.preventDefault()

    if (!titulo.trim() || salvando) return

    setSalvando(true)
    setMensagem('')

    const editando = Boolean(tarefaEditando)

    try {
      const url = editando
        ? `${API_URL}/${tarefaEditando}`
        : API_URL

      const resposta = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          status,
        }),
      })

      if (resposta.status === 401) {
        aoSair()
        return
      }

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || 'Erro ao salvar tarefa.'
        )
      }

      if (editando) {
        setTarefas((anteriores) =>
          anteriores.map((tarefa) =>
            tarefa._id === tarefaEditando
              ? dados.tarefa
              : tarefa
          )
        )
      } else {
        setTarefas((anteriores) => [
          dados.tarefa,
          ...anteriores,
        ])
      }

      setTarefaEditando(null)
      setTitulo('')
      setDescricao('')
      setStatus('pendente')

      setMensagem(
        editando
          ? 'Tarefa atualizada com sucesso!'
          : 'Tarefa criada com sucesso!'
      )
    } catch (erro) {
      setMensagem(
        erro.message || 'Não foi possível salvar a tarefa.'
      )
    } finally {
      setSalvando(false)
    }
  }

  async function excluirTarefa(id) {
    if (tarefaExcluindo) return

    const confirmar = window.confirm(
      'Tem certeza que deseja excluir esta tarefa?'
    )

    if (!confirmar) return

    setMensagem('')
    setTarefaExcluindo(id)

    try {
      const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (resposta.status === 401) {
        aoSair()
        return
      }

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || 'Erro ao excluir tarefa.'
        )
      }

      setTarefas((anteriores) =>
        anteriores.filter((tarefa) => tarefa._id !== id)
      )

      if (tarefaEditando === id) {
        cancelarEdicao()
      }

      setMensagem('Tarefa excluída com sucesso!')
    } catch (erro) {
      setMensagem(
        erro.message || 'Não foi possível excluir a tarefa.'
      )
    } finally {
      setTarefaExcluindo(null)
    }
  }

  return (
    <main className="dashboard">
      <header>
        <div>
          <h1>TaskFlow</h1>
          <p>Bem-vindo, {usuario.nome}!</p>
        </div>

        <button type="button" onClick={aoSair}>
          Sair
        </button>
      </header>

      <section>
        <h2>
          {tarefaEditando ? 'Editar tarefa' : 'Nova tarefa'}
        </h2>

        <form onSubmit={salvarTarefa}>
          <input
            type="text"
            placeholder="Título da tarefa"
            aria-label="Título da tarefa"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            maxLength={150}
            required
          />

          <textarea
            placeholder="Descrição da tarefa"
            aria-label="Descrição da tarefa"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
          />

          <select
            aria-label="Status da tarefa"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </select>

          <button type="submit" disabled={salvando}>
            {salvando
              ? 'Salvando...'
              : tarefaEditando
                ? 'Salvar alterações'
                : 'Criar tarefa'}
          </button>

          {tarefaEditando && (
            <button
              type="button"
              className="btn-cancelar"
              onClick={cancelarEdicao}
              disabled={salvando}
            >
              Cancelar edição
            </button>
          )}
        </form>
      </section>

      <section>
        <h2>Minhas tarefas</h2>

        {carregando ? (
          <p>Carregando tarefas...</p>
        ) : tarefas.length === 0 ? (
          <p>Nenhuma tarefa cadastrada.</p>
        ) : (
          <ul>
            {tarefas.map((tarefa) => (
              <li key={tarefa._id}>
                <h3>{tarefa.titulo}</h3>

                <p>
                  {tarefa.descricao || 'Sem descrição.'}
                </p>

                <p>
                  <strong>Status: </strong>
                  {formatarStatus(tarefa.status)}
                </p>

                <div className="acoes-tarefa">
                  <button
                    type="button"
                    className="btn-editar"
                    onClick={() => iniciarEdicao(tarefa)}
                    disabled={salvando || Boolean(tarefaExcluindo)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="btn-excluir"
                    onClick={() => excluirTarefa(tarefa._id)}
                    disabled={salvando || Boolean(tarefaExcluindo)}
                  >
                    {tarefaExcluindo === tarefa._id
                      ? 'Excluindo...'
                      : 'Excluir'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {mensagem && <p role="status">{mensagem}</p>}
    </main>
  )
}

export default Dashboard
