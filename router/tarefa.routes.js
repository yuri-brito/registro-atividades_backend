import express from "express";
import TarefaModel from "../model/tarefa.model.js";
import AtividadeModel from "../model/atividade.model.js";
import DeducaoModel from "../model/deducao.model.js";
import SetorModel from "../model/setor.model.js";
import UsuarioModel from "../model/usuario.model.js";
const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const data = await TarefaModel.find()
      .populate("usuarios")
      .populate("chefe")
      .populate("substituto")
      .populate("atividades")
      .populate("deducoes");
    return response.status(200).json(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const processo = await TarefaModel.findById(id)
      .populate("usuarios")
      .populate("chefe")
      .populate("substituto")
      .populate("atividades")
      .populate("deducoes");
    if (!processo) {
      return response.status(404).json("Usuário não foi encontrado!");
    }
    return response.status(200).json(processo);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.post("/create", async (request, response) => {
  try {
    const newTarefa = await TarefaModel.create(request.body);
    await UsuarioModel.findByIdAndUpdate(
      request.body.usuario,
      {
        $push: { tarefas: newTarefa._id },
      },
      { new: true, runValidators: true }
    );

    return response.status(201).json(newTarefa);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.put("/edit/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const update = await TarefaModel.findByIdAndUpdate(
      id,
      { ...request.body },
      { new: true, runValidators: true }
    );
    return response.status(200).json(update);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.delete("/delete/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const deleteTarefa = await TarefaModel.findByIdAndDelete(id);
    await AtividadeModel.deleteMany({ setor: id });
    await DeducaoModel.deleteMany({ setor: id });
    return response.status(200).json(deleteTarefa);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

export default router;
