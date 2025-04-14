const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB_FILE = "products.json";

// Leer base de datos simulada
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Guardar base de datos simulada
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Product microservice is running!");
});

// Crear producto
app.post("/products", async (req, res) => {
  const { id, name, unit_price, quantity } = req.body;

  if (!id || !name || unit_price === undefined || quantity === undefined) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Llama al microservicio de cálculo
    const response = await axios.post(
      "http://calculation-service:5001/CalculateValueTotal",
      {
        unit_price: unit_price,
        quantity: quantity,
      }
    );

    const valueTotal = response.data.valueTotal;

    const db = readDB();
    db.push({ id, name, unit_price, quantity, valueTotal });
    writeDB(db);

    res.status(201).send({ message: "Product created", valueTotal });
  } catch (error) {
    console.error("Error al llamar al servicio de cálculo:", error.message);
    res
      .status(500)
      .send({
        message: "Error al llamar al servicio de cálculo",
        error: error.message,
      });
  }
});

// Obtener productos
app.get("/products", (req, res) => {
  res.send(readDB());
});

// Actualizar producto existente
app.put("/products/:id", async (req, res) => {
  const db = readDB();
  const index = db.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).send({ message: "Product not found" });
  }

  const product = db[index];
  const { unit_price, quantity } = req.body;

  if (unit_price !== undefined) product.unit_price = unit_price;
  if (quantity !== undefined) product.quantity = quantity;

  try {
    const response = await axios.post(
      "http://calculation-service:5001/CalculateValueTotal",
      {
        unit_price: product.unit_price,
        quantity: product.quantity,
      }
    );

    product.valueTotal = response.data.valueTotal;
    db[index] = product;
    writeDB(db);

    res.send(product);
  } catch (error) {
    console.error("Error recalculating total value:", error.message);
    res.status(500).send({ message: "Error recalculating total value" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("product-service is running on http://localhost:3000");
});
