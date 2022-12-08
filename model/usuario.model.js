import { Schema, model } from "mongoose";

const usuarioSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
    },
    active: {
      type: Boolean,
      default: true,
    },
    senhaHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["usuario", "gestor", "admin"],
      default: "usuario",
    },
    setor: {
      type: Schema.Types.ObjectId,
      ref: "Setor",
    },
    profileImg: {
      type: String,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    tarefas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tarefa",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UsuarioModel = model("Usuario", usuarioSchema);

export default UsuarioModel;
