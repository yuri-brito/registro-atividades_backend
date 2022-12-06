import UserModel from "../model/usuario.model.js";

async function attachCurrentUser(request, response, next) {
  try {
    const loggedUser = request.auth;
    const user = await UserModel.findOne({ _id: loggedUser._id });
    if (!user) {
      return response.status(400).json({ msg: "Usuário inexistente!" });
    }
    request.currentUser = user;
    next();
  } catch (error) {
    console.log(error);
    return response.status(500).json(`Erro interno no servidor!`, error);
  }
}
export default attachCurrentUser;
