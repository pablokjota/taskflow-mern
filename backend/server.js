
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do TaskFlow funcionando!"
  });
});

async function iniciarServidor() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não configurada no .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado com sucesso!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar o servidor:", erro.message);
    process.exit(1);
  }
}

iniciarServidor();
