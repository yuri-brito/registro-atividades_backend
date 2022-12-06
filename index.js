import express from "express";
import * as dotenv from "dotenv";
// import atividadeRouter from "./router/atividade.routes.js";
// import deducaoRouter from "./router/deducao.routes.js";
import setorRouter from "./router/setor.routes.js";
import tarefaRouter from "./router/tarefa.routes.js";
import usuarioRouter from "./router/usuario.routes.js";
import cors from "cors";
import dbConnect from "./config/db.config.js";
dotenv.config();
dbConnect();
const app = express();
app.use(cors({ origin: process.env.REACT_URL }));
app.use(express.json());
app.use("/usuario", usuarioRouter);
app.use("/tarefa", tarefaRouter);
// app.use("/atividade", atividadeRouter);
// app.use("/deducao", deducaoRouter);
app.use("/setor", setorRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server up and running on port ${process.env.PORT}`);
});
