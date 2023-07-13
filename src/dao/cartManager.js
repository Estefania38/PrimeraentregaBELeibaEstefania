import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { __dirname } from "../utils.js";

export class CartManager {
  constructor(fileName) {
    this.path = path.join(__dirname, `/files/${fileName}`);
    this.loadCarts();
  }

  carts = [];

  fileExists() {
    return fs.existsSync(this.path);
  }

  async getAll() {
    try {
      if (this.fileExists()) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(content);
        return carts;
      } else {
        throw new Error("No es posible obtener los carritos");
      }
    } catch (error) {
      throw error;
    }
  }

  getNextId() {
    return uuidv4();
  }

  async save() {
    try {
      const newId = uuidv4();
      const newCart = {
        id: newId,
        products: []
      };

      this.carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
      return newCart;
    } catch (error) {
      throw error;
    }
  }
  getNextId() {
    return uuidv4();
  }

  addCart(cartId, productId) {
    const cart = this.getCartById(cartId);

    if (cart) {
      const existingProduct = cart.products.find(p => p.product === productId);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        const newProduct = { product: productId, quantity: 1 };
        cart.products.push(newProduct);
      }

      this.saveCarts();
    } else {
      throw new Error("Carrito no encontrado");
    }
  }

  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  loadCarts() {
    try {
      if (this.fileExists()) {
        const fileContent = fs.readFileSync(this.path, "utf-8");
        this.carts = JSON.parse(fileContent);
      } else {
        this.carts = [];
      }
    } catch (error) {
      console.error("Error al cargar los carritos:", error);
      this.carts = [];
    }
  }

  saveCarts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 4));
      console.log("Carritos guardados con éxito.");
    } catch (error) {
      console.error("Error al guardar los carritos:", error);
    }
  }

  getNextId() {
    const lastId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
    return lastId > 0 ? lastId + 1 : 1;
  }
}


