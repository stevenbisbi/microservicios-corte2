const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB_FILE = "products.json";

// Leer la "base de datos" simulada
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Escribir en la "base de datos"
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Ruta raíz
app.get("/", (req, res) => {
  res.send("¡El microservicio de productos está funcionando!");
});

// Crear un producto
app.post("/products", async (req, res) => {
  const { id, name, unit_price, quantity } = req.body;

  if (!id || !name || unit_price === undefined || quantity === undefined) {
    return res.status(400).send({ message: "Faltan campos requeridos" });
  }

  try {
    const response = await axios.post(
      process.env.CALC_SERVICE_URL ||
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

    res
      .status(201)
      .send({ message: "Producto creado correctamente", valueTotal });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al llamar al microservicio de cálculo" });
  }
});

// Consultar todos los productos
app.get("/products", (req, res) => {
  res.send(readDB());
});

// Consultar producto por ID
app.get("/products/:id", (req, res) => {
  const db = readDB();
  const product = db.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).send({ message: "Producto no encontrado" });
  }

  res.send(product);
});

// Actualizar producto
app.put("/products/:id", async (req, res) => {
  const db = readDB();
  const index = db.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).send({ message: "Producto no encontrado" });
  }

  const product = db[index];
  const { name, unit_price, quantity } = req.body;

  if (name !== undefined) product.name = name;
  if (unit_price !== undefined) product.unit_price = unit_price;
  if (quantity !== undefined) product.quantity = quantity;

  try {
    const response = await axios.post(
      process.env.CALC_SERVICE_URL ||
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
    res.status(500).send({ message: "Error al recalcular el valor total" });
  }
});

// Iniciar servidor solo si es el archivo principal
if (require.main === module) {
  app.listen(3000, () => {
    console.log(
      "🔧 El microservicio de productos está corriendo en http://localhost:3000"
    );
  });
}

module.exports = app; // Exportación para pruebas con supertest
