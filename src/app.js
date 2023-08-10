import express from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config.js";

// Importar las rutas para cada uno de los puntos finales
import ProductRouter from "./routes/productRoutes.js";
import UserRouter from "./routes/userRoutes.js";
import OrderRouter from "./routes/orderRoutes.js"; // Agrega esta línea

// Servidor
const app = express();

// Intermediarios
app.use(cors());

// Utilizar morgan para registrar peticiones HTTP
app.use(morgan(config.LOG_FORMAT || "development" ? "combined" : "dev"));

// Utilizar express para analizar cuerpos JSON y cuerpos codificados mediante URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(`${config.API_PREFIX}/productos/`, ProductRouter);
app.use(`${config.API_PREFIX}/users/`, UserRouter);
app.use(`${config.API_PREFIX}/orders/`, OrderRouter); // Agrega esta línea

// Exportar la aplicación para que pueda utilizarse en index.js
export default app;
