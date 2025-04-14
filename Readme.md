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

```plaintext
microservicios-corte2/
│
├── nodeService/                  # Servicio de productos (Node.js)
│   ├── index.js
│   ├── products.json
│   └── Dockerfile
│
├── pythonService/                # Servicio de cálculo (Python)
│   ├── app.py
│   └── Dockerfile
│
├── docker-compose.yml           # Orquestación de ambos servicios
└── .gitignore
```
