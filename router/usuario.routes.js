import express from "express";
import SetorModel from "../model/setor.model.js";
import UsuarioModel from "../model/usuario.model.js";
import TarefaModel from "../model/tarefa.model.js";
import generateToken from "../config/jwt.config.js";
import bcrypt from "bcrypt";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import nodemailer from "nodemailer";
const router = express.Router();
const rounds = 10;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    secure: true,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/create", async (request, response) => {
  try {
    const { password, email } = request.body;
    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/
      )
    ) {
      return response
        .status(400)
        .json({ msg: "A senha não tem os requisitos de segurança!" });
    }
    const saltString = await bcrypt.genSalt(rounds);
    const hashPassword = await bcrypt.hash(password, saltString);
    console.log(request.body, "<-request.body");
    const newUsuario = await UsuarioModel.create({
      ...request.body,
      senhaHash: hashPassword,
    });
    console.log(newUsuario);
    delete newUsuario._doc.senha;
    const mailOptions = {
      from: "yurisb85@gmail.com",
      to: email,
      subject: "Ativação de conta",
      html: `<h1> Bem vindo ao nosso site.</h1>
      <p> Por favor, confirme seu email clicando no link abaixo:</p>
      <a href=http://localhost:8080/usuario/activate-account/${newUsuario._id}>ATIVE SUA CONTA</a>`,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    return response.status(201).json(newUsuario);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.get("/activate-account/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const user = await UsuarioModel.findByIdAndUpdate(idUser, {
      confirmEmail: true,
    });

    console.log(user);

    return res.send(`Sua conta foi ativada com sucesso, ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});
router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await UsuarioModel.findOne({ email: email });
    if (user.confirmEmail === false) {
      return response
        .status(401)
        .json({ msg: "Usuário não confirmado. Por favor validar email." });
    }
    if (!user) {
      return response.status(400).json({ msg: "Usuário não cadastrado" });
    }
    if (await bcrypt.compare(password, user.senhaHash)) {
      delete user._doc.senhaHash;
      const token = generateToken(user);
      return response.status(200).json({
        user: { ...user._doc },
        token: token,
      });
    } else {
      return response.status(401).json({ msg: "Email ou senha inválidos!" });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.get("/profile", isAuth, attachCurrentUser, async (request, response) => {
  try {
    const loggedUser = request.currentUser;
    if (!loggedUser) {
      return response.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const user = await UsuarioModel.findById(loggedUser._id)
      .populate("tarefas")
      .populate("setor");
    delete user._doc.senhaHash;
    return response.status(200).json(user);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.get("/all", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  try {
    const users = await UsuarioModel.find({}, { senhaHash: 0 });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const usuario = await UsuarioModel.findById(id)
      .populate({
        path: "tarefas",
        populate: {
          path: "usuario",
          model: "Usuario",
          select: "name email active -_id",
        },
      })
      .populate("setor");
    if (!usuario) {
      return response.status(404).json("Usuário não foi encontrado!");
    }
    return response.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

router.put("/edit/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const update = await UsuarioModel.findByIdAndUpdate(
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
    const deleteUsuario = await UsuarioModel.findByIdAndDelete(id);
    await TarefaModel.deleteMany({ setor: id });
    return response.status(200).json(deleteUsuario);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Erro interno no servidor!" });
  }
});

export default router;
