# 🧩 Microservicios - Gestión de Inventario

Este proyecto consiste en un sistema distribuido basado en **microservicios**, desarrollado como parte de una entrega académica. El objetivo es mejorar la gestión de inventario de productos y calcular automáticamente el valor total de cada producto.

---

## 📐 Arquitectura

La solución está compuesta por dos microservicios:

### 1️⃣ `producto-service` (Node.js)

Responsable de:

- Registrar, consultar y actualizar productos.
- Enviar datos de precio y cantidad al servicio de cálculo para obtener el valor total.

### 2️⃣ `calculation-service` (Python)

Responsable de:

- Calcular el valor total (`unit_price * quantity`) a partir de los datos recibidos.

Ambos servicios se comunican vía **HTTP** y utilizan archivos `.json` para simular persistencia.

---

## ⚙️ Tecnologías

- Node.js (Express)
- Python (Flask)
- Axios (comunicación HTTP)
- JSON (persistencia)
- Docker & Docker Compose

---

## 📁 Estructura del Proyecto

```
microservicios-corte2/
│
├── nodeService/                  # Servicio de productos (Node.js)
│   ├── index.js
│   ├── products.json
│   └── Dockerfile
|   └── Package.json
|   └── products.test.js
│
├── pythonService/                # Servicio de cálculo (Python)
│   ├── app.py
│   └── Dockerfile
│   └── requirements.txt
│   └── test_app.py
│
├── docker-compose.yml           # Orquestación de ambos servicios
└── .gitignore
└── .Readme.md
```


---

## 🚀 ¿Cómo ejecutar el proyecto?

### ✅ Con Docker Compose

```bash
docker-compose up --build
```
http://localhost:3000/products → servicio de productos

http://localhost:5001/CalculateValueTotal → servicio de cálculo

---

🧪 Pruebas Unitarias
Node.js (Jest)
```bash

cd nodeService
npm install
npx jest
```
Python (Unittest)
```bash

cd pythonService
python test_app.py
```

---

🔁 Endpoints del Servicio de Productos
POST /products
Crea un nuevo producto:

```json

{
  "id": "P001",
  "name": "Mouse Gamer",
  "unit_price": 150,
  "quantity": 2
}
```
GET /products
Consulta todos los productos registrados.

PUT /products/:id
Actualiza unit_price o quantity, y recalcula automáticamente el valueTotal.

---

📦 Persistencia Simulada
Todos los productos se almacenan en el archivo products.json dentro de nodeService/.

```yaml

volumes:
  - ./nodeService/products.json:/app/products.json
```
