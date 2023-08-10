import { Router } from "express";
import fileUpload from "express-fileupload";
import * as productController from "../controllers/productController.js";

const router = Router();

router.get("/producto/:id", productController.getProductById);
router.post(
  "/add",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./src/uploads",
  }),
  productController.postProduct
);

router.get("/", productController.getProducts);

//para obtener una categoría de la base de datos
router.get("/category", productController.getCategories);
router.get("/category/:id", productController.getCategoryById);


export default router;
