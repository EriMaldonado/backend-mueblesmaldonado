//Almacenamiento de imagenes base de datos en la nube
import cloudinary from "cloudinary";

// 1. Importar la biblioteca cloudinary
try {
  // 2. Intenta acceder a la biblioteca cloudinary
  cloudinary.config({
    // 3. Configurar la biblioteca cloudinary
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });
  console.log("Connected to Cloudinary");
} catch (error) {
  // 4. Si se produce un error, muestra un mensaje en la consola
  console.log("Error connecting to Cloudinary");
}
