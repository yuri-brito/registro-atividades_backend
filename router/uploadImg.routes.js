import express from "express";
import fileUpload from "../config/cloudinary.config.js";
const router = express.Router();

router.post(
  "/upload-image",
  fileUpload.single("picture"),
  (request, response) => {
    if (!request.file) {
      return response.status(400).json({ msg: "Upload da imagem falhou!" });
    }
    return response.status(200).json({ url: request.file.path });
  }
);
export default router;
