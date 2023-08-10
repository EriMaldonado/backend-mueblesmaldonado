import Products from "../models/productModel.js";
import {
  uploadImageProduct,
  deleteImageProduct,
} from "../utils/cloudinaryConfig.js";
import HTTP_STATUS from "http-status-codes";
import fs from "fs-extra";

// Crear un producto
export const postProduct = async (req, res) => {
  // Comprobar si se envían todos los campos
  if (
    !req.body.id ||
    !req.body.title ||
    !req.body.category ||
    !req.body.description ||
    !req.body.type
  ) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    // Crear un nuevo producto
    const newProduct = new Products({
      id: req.body.id,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      priceCocina: req.body.priceCocina,
      priceCloset: req.body.priceCloset,
      priceDeskBasic:req.body.priceDeskBasic,
      priceDeskStandard:req.body.priceDeskStandard,
      priceMesaBasic: req.body.priceMesaBasic,
      priceMesaStandard: req.body.priceMesaStandard,
      pricelibreroBasic: req.body.pricelibreroBasic,
      pricelibreroStandard: req.body.pricelibreroStandard,
      priceVeladorBasic: req.body.priceVeladorBasic,
      priceVeladorStandard: req.body.priceVeladorStandard,
      priceComodaBasic: req.body.priceComodaBasic,
      priceComodaStandard: req.body.priceComodaStandard,
      pricetvBasic: req.body.pricetvBasic,
      pricetvStandard: req.body.pricetvStandard,
      pricePanelBasic: req.body.pricePanelBasic,
      pricePanelStandard: req.body.pricePanelStandard,
      priceTwin: req.body.priceTwin,
      priceDouble: req.body.priceDouble,
      priceQueen: req.body.priceQueen,
      priceKing: req.body.priceKing,
      type: req.body.type,
    });

    // Si las imágenes están cargadas, cárguelas en Cloudinary
    if (req.files) {
      for (const key of Object.keys(req.files)) {
        const image = req.files[key];
        const result = await uploadImageProduct(image.tempFilePath);
        newProduct.images.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
        await fs.unlink(image.tempFilePath);
      }
    }

    // Guardar el producto en la base de datos y devolver el producto guardado
    const savedProduct = await newProduct.save();

    // Devolver el producto guardado con un código de estado 201
    return res.status(HTTP_STATUS.CREATED).json(savedProduct);
  } catch (error) {
    // Si hay un error, devolver el error con un código de estado 500
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// Obtener información de todos los productos registrados
export const getProducts = async (req, res) => {
  try {
    const { type } = req.params;
    let products;

    // Filtrar productos por tipo si se proporciona el parámetro 'type'
    if (type) {
      products = await Products.find({ category: type });
    } else {
      products = await Products.find();
    }

    // Devolver los productos con un código de estado 200
    return res.status(HTTP_STATUS.OK).json(products);
  } catch (error) {
    // Si se produce un error, devolver el error con un código de estado 500
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error);
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    // Obtener el ID del producto desde los parámetros de la ruta
    const { id } = req.params;

    // Buscar el producto en la base de datos por el campo "id"
    const product = await Products.findOne({ id });

    // Si no se encuentra ningún producto, devolver un error 404
    if (!product) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // Si se encuentra un producto, devolver el producto con un código de estado 200
    return res.status(HTTP_STATUS.OK).json(product);
  } catch (error) {
    // Si se produce un error, devolver el error con un código de estado 500
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// Eliminar un producto por ID
export const deleteProductById = async (req, res) => {
  try {
    // Obtener el ID del producto desde los parámetros de la ruta
    const { id } = req.params;

    // Buscar el producto en la base de datos por el campo "id"
    const product = await Products.findOne({ id });

    // Si no se encuentra ningún producto, devolver un error 404
    if (!product) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // Si se encuentra un producto, eliminar la imagen asociada en cloudinary (si existe)
    if (product.image?.public_id) {
      await deleteImageProduct(product.image.public_id);
    }

    // Eliminar el producto de la base de datos
    await product.remove();

    // Devolver un mensaje de éxito con un código de estado 200
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Product deleted successfully" });
  } catch (error) {
    // Si se produce un error, devolver el error con un código de estado 500
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

//Obtener categoria por el id
export const getCategoryById = async (req, res) => {
  // Obtener el id de la solicitud
  const id = req.params.id;
  try {
    // Buscar la categoria por el Id
    const category = await Category.findById(id);
    // Si no se encuentra la categoría, devuelve un estado 404
    if (!category) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `No category found by id ${id}` });
    }
    // Si se encuentra la categoría, devuelve un estado 200
    return res.status(HTTP_STATUS.OK).json(category);
  } catch (error) {
    // Si hay un error, devuelve un estado 500
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

//OBTENER TODAS LAS CATEGORÍAS
export const getCategories = async (req, res) => {
  try {
    // Obtener todas las categorías de la base de datos
    const categories = await Category.find();

    // Si no se encuentra ninguna categoría, envía una respuesta 404
    if (!categories) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "No categories found" });
    }

    // Enviar las categorías encontradas en una respuesta JSON
    return res.status(HTTP_STATUS.OK).json(categories);
  } catch (error) {
    // Si se produce un error, envíe el mensaje de error en formato JSON
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};