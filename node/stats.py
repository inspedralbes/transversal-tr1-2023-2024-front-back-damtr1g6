import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
import numpy as np
import json

#Per llegir l'arxiu json
df = pd.read_json('data.json')

data = {
  "Usuarios": [...],  # (no se utiliza en este ejemplo)
  "Productos": [...],
  "Comanda": [...],  # (no se utiliza en este ejemplo)
  "Contiene": [...]   # (no se utiliza en este ejemplo)
}

productos = data['Productos']

#Contadores
productos_activos = 0
productos_inactivos = 0

for producto in productos:
  if producto["estado"] == "Disponible":
      productos_activos += 1
  else:
      productos_inactivos += 1

# Crear una lista con las etiquetas y otra con los valores
etiquetas = ["Activos", "Inactivos"]
valores = [productos_activos, productos_inactivos]

#Grafica: estat del producte (actiu o inactiu)
x_values = df['Productos.estado'].unique()
y_values = df['Productos.estado'].value_counts().tolist()
plt.bar(x_values, y_values)
plt.show()
plt.close('all')


# #Grafica: estado comandas (preparando, procesando y recibida)
# x_values = df['Comanda.estado'].unique()
# y_values = df['Comanda.estado'].value_counts().tolist()
# plt.bar(x_values, y_values)
# plt.show()
# plt.close('all')


# #Grafica: stock productos NO ACABADO ??
# x_values = df['Productos.stock'].unique()
# y_values = df['Productos.stock'].value_counts().tolist()
# plt.bar(x_values, y_values)
# plt.xlabel("Productos Pulse")
# plt.ylabel("Calorie Burnage")
# plt.show()
# plt.close('all')


# #Grafica: cantidad de productos en comandas
# x_values = df['Productos.estado'].unique()
# y_values = df['Productos.estado'].value_counts().tolist()
# plt.barh(x_values, y_values)
# plt.show()
# plt.close('all')



