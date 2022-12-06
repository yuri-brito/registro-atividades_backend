function isGestor(req, res, next) {
  if (req.auth.role !== "gestor") {
    return res
      .status(401)
      .json({ msg: "Usuário não autorizado para esta rota!" });
  }

  next();
}

export default isGestor;
