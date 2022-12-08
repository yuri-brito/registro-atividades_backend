function isGestor(req, res, next) {
  if (req.auth.role !== "gestor" && req.auth.role !== "admin") {
    return res
      .status(401)
      .json({ msg: "Usuário não autorizado para esta rota!" });
  }

  next();
}

export default isGestor;
