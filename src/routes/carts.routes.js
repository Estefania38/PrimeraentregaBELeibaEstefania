import { Router } from "express";
import { CartManager } from "../dao/cartManager.js";
import { ProductManager } from "../dao/ProductManager.js";


const router = Router();

const cartService = new CartManager("carts.json");
const productService = new ProductManager("products.json");


// Ruta Raiz POST
router.post("/", async (req, res) => {
  try {
    const newCart = await cartService.save();
    res.json({ status: "success", message: "Carrito creado", data: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Ruta GET /:cid
router.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const cart = cartService.getCartById(cartId);

  if (cart) {
    res.json({ status: "success", data: cart.products });
  } else {
    res.status(404).json({ status: "error", message: "Carrito no encontrado" });
  }
});

// Ruta POST /:cid/product/:pid
router.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    cartService.addCart(cartId, productId);
    res.json({ status: "success", message: "Producto agregado al carrito" });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});


export { router as cartsRouter };
