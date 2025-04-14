from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/CalculateValueTotal', methods=['POST'])
def calculateTotal():
    #Obtiene el cuerpo JSON enviado en la solicitud
    data = request.json

    # Extrae los valores enviados desde el microservicio productos
     
    unitPrice = data['unitPrice']
    quantity = data['quantity']
    
    valueTotal = (
        unitPrice * quantity
    )
    
    # Retorna el valor total en formato JSON
    return jsonify({'valor_total': valueTotal}) 

# Esta condición asegura que la app se ejecute solo si se ejecuta directamente (no al ser importada)
if __name__ == '__main__':
    # Inicia el servidor Flask en todas las direcciones (0.0.0.0) y en el puerto 5001
    # Esto permite que el contenedor Docker lo exponga correctamente
    app.run(host='0.0.0.0', port=5001)
    