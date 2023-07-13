import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import {__dirname} from "../utils.js";

export class ProductManager {
  constructor(fileName) {    
    this.path = path.join(__dirname, `/files/${fileName}`);
    this.loadProducts();
  }

  loadProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = fs.readFileSync(this.path, 'utf-8');
        this.products = JSON.parse(fileContent);
      } else {
        this.products = [];
      }
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      this.products = [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 4));
      console.log("Productos guardados con éxito.");
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }

  async get() {
    try {
      if (fs.existsSync(this.path)) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(content);
        return products;
      } else {
        throw new Error("No es posible obtener los productos");
      }
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.error("Error: producto no encontrado");
    }
  }

  async save(product) {
    try {
      if (fs.existsSync(this.path)) {
        let newId = uuidv4();
        const newProduct = {
          id: newId,
          ...product
        };
        this.products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        return newProduct;
      } else {
        throw new Error("No es posible esta operación");
      }
    } catch (error) {
      throw error;
    }
  }


  addProduct(newProduct) {
    const { title, description, price, thumbnail, code, stock, category } = newProduct;

    if (!title.trim() || !description.trim() || !price || !thumbnail.trim() || !code || !stock || !category.trim()) {
      console.error("Error: todos los campos son obligatorios");
      return;
    }
    if (typeof price !== 'number' || price <= 0) {
      console.error("Error: el precio debe ser un número positivo");
      return;
    }
    if (typeof stock !== 'number' || stock <= 0 || !Number.isInteger(stock)) {
      console.error("Error: el stock debe ser un número entero positivo");
      return;
    }
    if (this.products.some((product) => product.code === code)) {
      console.error(`Error: el producto con el código ${code} ya existe`);
      return;
    }

    const newProductData = {
      id: this.getNextId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: true,
      category,
    };

    this.products.push(newProductData);
    this.saveProducts();

    console.log("Producto agregado con éxito. El nuevo producto es:", newProductData);
  }

  updateProduct(productId, updatedFields) {
    const index = this.products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts();
      console.log("Producto actualizado con éxito. El producto actualizado es:", this.products[index]);
      return true;
    }
    console.error("Error: producto no encontrado");
    return false;
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((product) => product.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }

 getNextId() {
    const lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    return lastId > 0 ? lastId + 1 : 1;
  }
}
