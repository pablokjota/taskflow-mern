
const Task = require('../models/Task');

// Criar uma nova tarefa
const criarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body;

    if (typeof titulo !== 'string' || !titulo.trim()) {
      return res.status(400).json({
        mensagem: 'O título da tarefa é obrigatório.',
      });
    }

    const tarefa = await Task.create({
      titulo: titulo.trim(),
      descricao,
      status,
      usuario: req.usuario.id,
    });

    return res.status(201).json({
      mensagem: 'Tarefa criada com sucesso!',
      tarefa,
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao criar tarefa.',
    });
  }
};

// Listar tarefas do usuário
const listarTarefas = async (req, res) => {
  try {
    const tarefas = await Task.find({
      usuario: req.usuario.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(tarefas);
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao listar tarefas.',
    });
  }
};

// Atualizar uma tarefa
const atualizarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body;

    const tarefa = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        usuario: req.usuario.id,
      },
      { titulo, descricao, status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tarefa) {
      return res.status(404).json({
        mensagem: 'Tarefa não encontrada.',
      });
    }

    return res.status(200).json({
      mensagem: 'Tarefa atualizada com sucesso!',
      tarefa,
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao atualizar tarefa.',
    });
  }
};

// Excluir uma tarefa
const excluirTarefa = async (req, res) => {
  try {
    const tarefa = await Task.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id,
    });

    if (!tarefa) {
      return res.status(404).json({
        mensagem: 'Tarefa não encontrada.',
      });
    }

    return res.status(200).json({
      mensagem: 'Tarefa excluída com sucesso!',
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao excluir tarefa.',
    });
  }
};

module.exports = {
  criarTarefa,
  listarTarefas,
  atualizarTarefa,
  excluirTarefa,
};
