import { config } from "dotenv";    // importar modulo dotenv
config();                            // inicializar dotenv

// Configurar variables de entorno
export default {
  MONGODB_URI: process.env.MONGODB_URI,   // MongoDB URI
  API_PREFIX: process.env.API_PREFIX,     // API prefijo
  LOG_FORMAT: process.env.LOG_FORMAT,     // Formato LOG
  PORT: process.env.PORT,                 // Puerto
  jwtSecret:"adgjlwryip"
};
