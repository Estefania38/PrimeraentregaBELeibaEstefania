import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";


const router = Router();
const productService = new ProductManager('products.json');

// Ruta raíz GET /
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productService.get();
    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = products.slice(0, limit);
      res.json({ status: "success", data: limitedProducts });
    } else {
      res.json({ status: "success", data: products });
    }
  } catch (error) {
    res.send(error.message);
  }
});

// Ruta GET /:pid
router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productService.getProductById(productId);
    if (product) {
      res.json({ status: "success", data: product });
    } else {
      res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
  } catch (error) {
    res.send(error.message);
  }
});

// Ruta POST /
router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    productService.addProduct(newProduct);
    res.json({ status: "success", message: "Producto creado" });
  } catch (error) {
    res.send(error.message);
  }
});

// Ruta PUT /:pid
router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    const success = await productService.updateProduct(productId, updatedFields);
    if (success) {
      res.json({ status: "success", message: "Producto actualizado" });
    } else {
      res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
  } catch (error) {
    res.send(error.message);
  }
});

// Ruta DELETE /:pid
router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const success = await productService.deleteProduct(productId);
    if (success) {
      res.json({ status: "success", message: "Producto eliminado" });
    } else {
      res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
  } catch (error) {
    res.send(error.message);
  }
});

export { router as productsRouter };


