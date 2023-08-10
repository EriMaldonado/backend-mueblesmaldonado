import { Router } from "express";
import fileUpload from "express-fileupload";
import * as userController from "../controllers/userController.js";


const router = Router();

// Ruta para iniciar sesión con cuenta de usuario
router.post("/login", userController.loginUser);

// Ruta para actualizar el usuario
router.put(
  "/update/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./src/uploads",
  }),
  userController.updateUser
);

// Ruta para crear un nuevo usuario
router.post(
  "/register",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./src/uploads",
  }),
  userController.postUser
);

// Ruta para obtener todos los usuarios
router.get("/all", userController.getUsers);

// Ruta para obtener un usuario por ID
router.get("/user/:id",  userController.getUserById);

// Ruta para eliminar un usuario
router.delete("/delete/:id", userController.deleteUser);



router.get("/user-info", userController.getUserInfo); // Puedes cambiar el nombre de la ruta ("/me") si lo prefieres
export default router;
