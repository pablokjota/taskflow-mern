
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body || {};

    
    if (
      typeof nome !== "string" ||
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !nome.trim() ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos corretamente.",
      });
    }

    
    const emailNormalizado = email.trim().toLowerCase();

    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido.",
      });
    }

    
    if (senha.length < 8) {
      return res.status(400).json({
        mensagem: "A senha deve ter pelo menos 8 caracteres.",
      });
    }

    
    const usuarioExistente = await User.findOne({
      email: emailNormalizado,
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    
    const senhaHash = await bcrypt.hash(senha, 10);

    
    const usuario = await User.create({
      nome: nome.trim(),
      email: emailNormalizado,
      senha: senhaHash,
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    console.error("Erro ao cadastrar usuário:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar usuário.",
    });
  }
};


const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body || {};

    
    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e a senha.",
      });
    }


    const usuario = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+senha");

    if (!usuario) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    
    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }
    
    const token = jwt.sign(
      {
        id: usuario._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
        algorithm: "HS256",
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    console.error("Erro ao realizar login:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao realizar login.",
    });
  }
};


module.exports = {
  cadastrarUsuario,
  loginUsuario,
};
