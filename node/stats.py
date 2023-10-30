import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
import numpy as np

#Per llegir l'arxiu json
df = pd.read_json('data.json')

#Grafica: estat del producte (actiu o inactiu)
x_values = df['Productos.estado'].unique()
y_values = df['Productos.estado'].value_counts().tolist()
plt.bar(x_values, y_values)
plt.show()
plt.close('all')


#Grafica: estado comandas (preparando, procesando y recibida)
x_values = df['Comanda.estado'].unique()
y_values = df['Comanda.estado'].value_counts().tolist()
plt.bar(x_values, y_values)
plt.show()
plt.close('all')


#Grafica: stock productos NO ACABADO ??
x_values = df['Productos.stock'].unique()
y_values = df['Productos.stock'].value_counts().tolist()
plt.bar(x_values, y_values)
plt.xlabel("Productos Pulse")
plt.ylabel("Calorie Burnage")
plt.show()
plt.close('all')


#Grafica: cantidad de productos en comandas
x_values = df['Productos.estado'].unique()
y_values = df['Productos.estado'].value_counts().tolist()
plt.barh(x_values, y_values)
plt.show()
plt.close('all')



