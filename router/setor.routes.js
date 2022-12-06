import express from "express";
import SetorModel from "../model/setor.model.js";
import AtividadeModel from "../model/atividade.model.js";
import DeducaoModel from "../model/deducao.model.js";
const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const data = await SetorModel.find()
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
    const setor = await SetorModel.findById(id)
      .populate("usuarios")
      .populate("chefe")
      .populate("substituto")
      .populate("atividades")
      .populate("deducoes");
    if (!setor) {
      return response.status(404).json("Usuário não foi encontrado!");
    }
    return response.status(200).json(setor);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.post("/create", async (request, response) => {
  try {
    const newSetor = await SetorModel.create(request.body);
    // await EmployeeModel.findByIdAndUpdate(
    //   employeeId,
    //   {
    //     $push: { processos: newProcesso._id },
    //   },
    //   { new: true, runValidators: true }
    // );

    return response.status(201).json(newSetor);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.put("/edit/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const update = await SetorModel.findByIdAndUpdate(
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
    const deleteSetor = await SetorModel.findByIdAndDelete(id);
    await AtividadeModel.deleteMany({ setor: id });
    await DeducaoModel.deleteMany({ setor: id });
    return response.status(200).json(deleteSetor);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

export default router;
