const request = require("supertest");
const express = require("express");
const fs = require("fs");
const app = require("./index");

describe("Producto Service", () => {
  beforeAll(() => {
    fs.writeFileSync("products.json", "[]"); // Reinicia base de datos falsa
  });

  it("Debe rechazar productos incompletos", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "Faltan campos" });
    expect(res.statusCode).toBe(400);
  });

  it("Debe obtener todos los productos", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

module.exports = app; // Para que pueda ser testeado
