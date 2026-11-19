
const express = require("express");
const router = express.Router();

const {
  criarTarefa,
  listarTarefas,
  atualizarTarefa,
  excluirTarefa,
} = require("../controllers/taskController");

const verificarToken = require("../middlewares/authMiddleware");


router.use(verificarToken);


router.post("/", criarTarefa);


router.get("/", listarTarefas);


router.put("/:id", atualizarTarefa);

router.delete("/:id", excluirTarefa);

module.exports = router;
