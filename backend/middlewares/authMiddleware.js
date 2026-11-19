
const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensagem: "Acesso negado. Token não fornecido.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        mensagem: "Token não fornecido.",
      });
    }

    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurada.");
    }

    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    if (!decoded.id) {
      return res.status(401).json({
        mensagem: "Token inválido.",
      });
    }

    
    req.usuario = {
      id: decoded.id,
    };

    next();
  } catch (erro) {
    if (erro instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        mensagem: "Token inválido ou expirado.",
      });
    }

    console.error("Erro na autenticação:", erro);

    return res.status(500).json({
      mensagem: "Erro interno na autenticação.",
    });
  }
};

module.exports = verificarToken;
