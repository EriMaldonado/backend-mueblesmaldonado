import { v2 as cloudinary } from "cloudinary";
// Path: backend\src\utils\cloudinaryConfig.js

// subir imagen a cloudinary y devolver la url de la imagen
export async function uploadImageProduct(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "mueblesmaldonado/products", // nombre de la carpeta cloudinary
  });
}
//borrar imagen de cloudinary
export async function deleteImageProduct(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}

//subir imagen usuario
export async function uploadImageUser(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "mueblesmaldonado/users",
  });
}

//borrar imagen usuario
export async function deleteImageUser(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}
