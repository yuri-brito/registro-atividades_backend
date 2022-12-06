import { Schema, model } from "mongoose";

const deducaoSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
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

const DeducaoModel = model("Deducao", deducaoSchema);

export default DeducaoModel;
