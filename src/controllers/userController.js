import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import { uploadImageUser, deleteImageUser } from "../utils/cloudinaryConfig.js";
import fs from "fs-extra";

// Inicio de sesión de usuario
export const loginUser = async (req, res) => {
  const JWT_SECRET = crypto.randomBytes(64).toString("hex");
  const user = await User.findOne({ email: req.body.email });
  // Si el usuario existe y la contraseña es correcta, enviar datos de usuario
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    // Devolver datos de usuario y token
    return res.status(StatusCodes.OK).json({
      token,
      _id: user._id,
      name: user.name,
      lastname: user.lastname,
      address: user.address,
      phone: user.phone,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
    });
  }
  // Email o contraseña inválidos
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Email or Password is invalid" });
};

// Obtener la clave secreta desde una variable de entorno (asegúrate de configurar esta variable en tu servidor)
const secretKey = process.env.JWT_SECRET_KEY;

export const getUserInfo = async (req, res) => {
  try {
    // Obtener el token de acceso del encabezado de la solicitud
    const token = req.header("Authorization").replace("Bearer ", "");

    // Decodificar el token utilizando la clave secreta
    const decodedToken = jwt.verify(token, secretKey);

    // Obtener el ID de usuario desde el token decodificado
    const userId = decodedToken._id;

    // Buscar el usuario en la base de datos por su ID
    const user = await User.findById(userId);

    if (!user) {
      // Si el usuario no se encuentra, devuelve un error
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si el usuario se encuentra, devuelve la información del usuario
    return res.status(200).json(user);
  } catch (error) {
    // Si hay algún error, devuelve un mensaje de error
    return res.status(500).json({ message: "Error al obtener la información del usuario" });
  }
};

// Crear usuario
export const postUser = async (req, res) => {
  // Comprobar si todos los campos están rellenados y enviar un error si no lo están
  if (
    !req.body.name ||
    !req.body.lastname ||
    !req.body.address ||
    !req.body.phone ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
  }

  try {
    // Crear un nuevo usuario con los datos del cuerpo de la solicitud
    const newUser = new User(req.body);
    newUser.image = {
      public_id: req.body.public_id || "mueblesmaldonado/users",
      secure_url:
        req.body.secure_url ||
        "https://res.cloudinary.com/doek4fbok/image/upload/v1685900872/mueblesmaldonado/users/seller_wellsk.png",
    };
    // Creación y cifrado de la contraseña
    newUser.password = bcrypt.hashSync(req.body.password);
    // Guardar la imagen en Cloudinary
    if (req.files?.image) {
      const result = await uploadImageUser(req.files.image.tempFilePath);
      newUser.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }
    // Guardar el usuario en la base de datos y enviar la respuesta
    const user = await newUser.save();
    return res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find();
    // Devolver todos los usuarios en la respuesta
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    // Si se produce un error, devolverlo en la respuesta
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    // Obtener usuario por ID de la base de datos
    const user = await User.findById(req.params.id);
    // Si el usuario no se encuentra en la base de datos
    if (!user) {
      // Devolver estado 404 y mensaje de error
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    // Devolver estado 200 y objeto de usuario
    return res.status(StatusCodes.OK).send(user);
  } catch (error) {
    // Devolver estado 404 y mensaje de error
    return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    // Si el usuario no se encuentra, devolver un error
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    // Actualizar datos del usuario con los datos proporcionados
    user.name = req.body.name || user.name;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;
    // Si se cambia la contraseña, cifrarla y guardarla en la base de datos
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password);
    }
    // Si se carga una nueva imagen, guardarla en Cloudinary y actualizar el enlace en la base de datos
    if (req.files?.image) {
      if (user.image?.public_id) {
        await deleteImageUser(user.image.public_id);
      }
      const result = await uploadImageUser(req.files.image.tempFilePath);
      user.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }
    // Guardar el usuario en la base de datos y enviar la respuesta
    const updatedUser = await user.save();
    return res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    // Si el usuario no se encuentra registrado, devolver un mensaje de error
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    // Validar el permiso del usuario
    const currentUser = await User.findById(req.user._id);
    if (!currentUser.isAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "You don't have permission to delete this user" });
    }
    // Eliminar usuario
    await user.remove();
    return res.status(StatusCodes.OK).json({ message: "User deleted" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};