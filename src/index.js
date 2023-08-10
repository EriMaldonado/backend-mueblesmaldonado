//Importar el archivo de la aplicación
import app from "./app.js";
//Importar el archivo de configuración
import config from "./config.js";
//Importar la base de datos fichero MongoDB
import "./databases/databaseMongoDB.js";
//Importar el archivo databaseCloudinary
import "./databases/databaseCloudinary.js";

//Puerto del Servidor
app.listen(config.PORT, () => {
  console.log(`Server at: http://localhost:${config.PORT}`);
});
