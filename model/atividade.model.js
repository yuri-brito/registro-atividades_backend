import { Schema, model } from "mongoose";

const atividadeSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
    },
    horasEsperadas: {
      type: Number,
    },
    setor: {
      type: Schema.Types.ObjectId,
      ref: "Setor",
    },
  },
  {
    timestamps: true,
  }
);

const AtividadeModel = model("Atividade", atividadeSchema);

export default AtividadeModel;
