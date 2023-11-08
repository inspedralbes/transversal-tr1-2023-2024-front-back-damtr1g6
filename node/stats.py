import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
import numpy as np
import json

#Per llegir l'arxiu json
try:
    with open('informacio/dades.json', 'r') as json_file:
        data = json.load(json_file)
except Exception as e:
    print(f"Error al cargar el archivo JSON: {e}")

print(data) 

#Per tenir les dades
products = data["Productos"]
contains = data["Contiene"]
orders = data["Comanda"]
users = data["Usuarios"]


#GRAFICA ESTATS DELS PRODUCTES
prodsNames = []
prodsStock = []

for product in products:
    name = product["nombre"]
    prodState = product["estado"]
    stock = int(product["stock"])
    prodsNames.append(name)
    prodsStock.append(stock)

    
    prodsAvailable = 0
    prodsNotAvailable = 0
    
    if prodState == "Disponible":
        prodsAvailable += 1
    else:
        prodsNotAvailable += 1

prodState = ["Disponible", "No Disponible"]

#Crear una lista con la cantidad de productos en cada estat
prodsTotal = prodsAvailable + prodsNotAvailable

prodsAvailablePercentage = (prodsAvailable / prodsTotal) * 100
prodsNotAvailablePercentage = (prodsNotAvailable / prodsTotal) * 100

prodsPercentages = [prodsAvailablePercentage, prodsNotAvailablePercentage]


plt.figure()
plt.bar(prodState, prodsPercentages, color=['blue', 'red'])
plt.xlabel('Estat del producte')
plt.ylabel('Quanitat de productes (%)')
plt.title('ESTATS DELS PRODUCTES')
plt.savefig('./graphics/estatProd.png')


#GRAFICA ESTADO DE COMANDAS (preparando, procesando y recibida)
#Contar cantidad de comandas en cada estado
orderState = {}

for order in orders:
    state = order.get("estado")
    orderState[state] = orderState.get(state,0)+1

states = list(orderState.keys())
ordersAmount = list(orderState.values())

colors = ['green', 'blue', 'orange', 'purple']

#Porcentaje eje y
totalOrders = sum(ordersAmount)

plt.figure()
plt.bar(states, ordersAmount, color=colors)
plt.xlabel('Estat de la comanda')
plt.ylabel('Quantitat de comandes')
plt.title('ESTAT DE LES COMANDES')
plt.ylim(0, totalOrders)
plt.savefig('./graphics/estatComandes.png')


#GRAFICA DE STOCK DE LOS PRODUCTOS
prodsNames =[]
prodsStock=[]

for prod in products:
    name = prod["nombre"]
    stock = int(prod["stock"])
    prodsNames.append(name)
    prodsStock.append(stock)


plt.figure(figsize=(10, 6)) 
plt.barh(prodsNames, prodsStock, color='blue')
plt.xlabel('Stock de productes')
plt.ylabel('Nom del porducte')
plt.title('STOCK DELS PRODUCTES')
plt.grid(axis='x', linestyle='--', alpha=0.6)  
plt.tight_layout()  
plt.savefig('./graphics/stock.png')



#GRAFICA QUANTITAT DE PRODUCTES EN COMANDES
# orderProcess = []
# prodXOrder = []

# for order in data["Comanda"]:
#     if order["estado"] != "Rebuda":
#         orderProcess.append(order)

# for order in orderProcess:
#     prodQuant = 0
#     for conte in data["Contiene"]:
#         if conte["id_comanda"] == order["id"]:
#             prodQuant += 1
#     prodXOrder.append(prodQuant)

# ordersLabel = [f'Comanda {order["id"]}' for order in orderProcess]


# plt.figure(figsize=(10, 6))
# plt.barh(prodXOrder,range(len(orderProcess)), color='skyblue')
# plt.ylabel('Comandes')
# plt.xlabel('Quantitat de productes')
# plt.title('QUANTITAT DE PRODUCTES EN COMANDES ACTIVES')
# plt.yticks(range(len(orderProcess)), ordersLabel, rotation=45)
# plt.tight_layout()
# plt.savefig('./informes/quantProd.png')



# #GRAFICA PRECIO DE LOS PRODUCTOS VS CANTIDAD VENDIDA ??
prodName = []
prodPrice = []

for prod in data["Productos"]:
    prodName.append(prod["nombre"])
    prodPrice.append(float(prod["precio"]))

plt.figure(figsize=(10, 6))
plt.scatter(prodPrice,prodName, alpha=0.5)
plt.title('ID de Producto vs Precio')
plt.ylabel('ID de Producto')
plt.xlabel('Precio (en euros)')
plt.grid(True)
plt.tight_layout()
plt.savefig('./informes/prodVSvendida.png')




#CANTIDAD DE COMANDAS HECHAS POR USUARIO

# Crear un diccionario para almacenar la cantidad de comandas por usuario
ordersPerUser = {}
usersNames = {}

names = []
ordersAmount = []


for user in users:
    ordersPerUser[user["id"]] = 0
    usersNames[user["id"]] = user["usuario"]


# Contar la cantidad de comandas para cada usuario
for order in orders:
    userID = order["id_user"]
    ordersPerUser[userID] += 1

# Extraer nombres de usuario para mostrar en el gráfico


# Crear listas para nombres de usuario y cantidad de comandas

# Llenar las listas con los datos
for userID, amount in ordersPerUser.items():
    names.append(usersNames[userID])  # Cambio "usuari_id" a "usuario_id"
    ordersAmount.append(amount)

# Crear el gráfico de barras
plt.figure(figsize=(10, 6))
plt.bar(names, ordersAmount, color='skyblue')
plt.title('QUANTITAT DE COMANDES PER USUARI')
plt.xlabel('Usuari')
plt.ylabel('Quantitat de comandes')
plt.xticks(rotation=45, ha='right')

# Mostrar el gráfico
plt.tight_layout()
plt.savefig('./informes/quantComand.png')


