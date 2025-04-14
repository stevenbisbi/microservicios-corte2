const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
app.use(express.json());

const DB_FILE = "products.json";

// Read local JSON "database"
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Write to local JSON "database"
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Root route
app.get("/", (req, res) => {
  res.send("Product microservice is running!");
});

// Create a new product
app.post("/products", async (req, res) => {
  const { id, name, unit_price, quantity } = req.body;

  if (!id || !name || unit_price === undefined || quantity === undefined) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Call the calculation microservice
    const response = await axios.post(
      "http://calculation-service:5001/CalculateValueTotal",
      {
        unit_price,
        quantity,
      }
    );

    const total_value = response.data.total_value;

    const db = readDB();
    db.push({ id, name, unit_price, quantity, total_value });
    writeDB(db);

    res.status(201).send({ message: "Product created", total_value });
  } catch (error) {
    res.status(500).send({ message: "Error calling calculation service" });
  }
});

// Get all products
app.get("/products", (req, res) => {
  res.send(readDB());
});

// Update an existing product
app.put("/products/:id", async (req, res) => {
  const db = readDB();
  const index = db.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).send({ message: "Product not found" });
  }

  const product = db[index];
  const { unit_price, quantity } = req.body;

  // Update only if new values are provided
  if (unit_price !== undefined) product.unit_price = unit_price;
  if (quantity !== undefined) product.quantity = quantity;

  try {
    const response = await axios.post(
      "http://calculation-service:5001/calculate",
      {
        unit_price: product.unit_price,
        quantity: product.quantity,
      }
    );

    product.total_value = response.data.total_value;
    db[index] = product;
    writeDB(db);

    res.send(product);
  } catch (error) {
    res.status(500).send({ message: "Error recalculating total value" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("product-service is running on http://localhost:3000");
});
