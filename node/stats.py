import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import json
import os
from datetime import datetime


#Verifica si existeix la carpeta
if not os.path.exists('./graphics'):
    os.makedirs('./graphics')


#Per llegir l'arxiu json
try:
    with open('informacio/dades.json', 'r') as json_file:
        data = json.load(json_file)
except Exception as e:
    print(f"Error al carregar l'arxiu JSON: {e}")

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

#Crear una lista amb la quantitat de productes en cada estat
prodsTotal = prodsAvailable + prodsNotAvailable

prodsAvailablePercentage = (prodsAvailable / prodsTotal) * 100
prodsNotAvailablePercentage = (prodsNotAvailable / prodsTotal) * 100

prodsPercentages = [prodsAvailablePercentage, prodsNotAvailablePercentage]


plt.figure()
plt.bar(prodState, prodsPercentages, color=['blue', 'red'])
plt.xlabel('Estat del producte')
plt.ylabel('Quanitat de productes (%)')
plt.title('ESTATS DELS PRODUCTES')
plt.savefig('./graphics/estatProd.jpg')


#GRAFICA ESTADO DE COMANDAS (rebuda, processant, preparada i recollida)
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
plt.savefig('./graphics/estatComandes.jpg')


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
plt.savefig('./graphics/stock.jpg')



#GRAFICA QUANTITAT DE PRODUCTES EN COMANDES
orderProcess = []
prodXOrder = []

for order in data["Comanda"]:
    if order["estado"] != "Recollida":
        orderProcess.append(order)

for order in orderProcess:
    prodQuant = 0
    for conte in data["Contiene"]:
        if conte["id_comanda"] == order["id"]:
            prodQuant += 1
    prodXOrder.append(prodQuant)

maxProdXOrder = max(prodXOrder)

ordersLabel = [f'Comanda {order["id"]}' for order in orderProcess]


plt.figure(figsize=(10, 6))
plt.barh(ordersLabel, prodXOrder, color='skyblue')
plt.ylabel('Comandes')
plt.xlabel('Quantitat de productes')
plt.title('QUANTITAT DE PRODUCTES EN COMANDES ACTIVES')
plt.yticks(range(len(orderProcess)), ordersLabel, rotation=45)
plt.xlim(0, maxProdXOrder) 
plt.tight_layout()
plt.savefig('./graphics/quantProd.jpg')



# #GRAFICA PRECIO DE LOS PRODUCTOS VS CANTIDAD VENDIDA
prodName = []
prodPrice = []

for prod in data["Productos"]:
    prodName.append(prod["nombre"])
    prodPrice.append(float(prod["precio"]))

plt.figure(figsize=(10, 6))
plt.scatter(prodPrice,prodName, alpha=0.5)
plt.title('Preu producte')
plt.ylabel('Nom del producte')
plt.xlabel('Preu')
plt.grid(True)
plt.tight_layout()
plt.savefig('./graphics/prodVSvendida.jpg')




#CANTIDAD DE COMANDAS HECHAS POR USUARIO
ordersPerUser = {}
usersNames = {}

names = []
ordersAmount = []

for user in users:
    ordersPerUser[user["id"]] = 0
    usersNames[user["id"]] = user["usuario"]

for order in orders:
    userID = order["id_user"]
    ordersPerUser[userID] += 1

for userID, amount in ordersPerUser.items():
    names.append(usersNames[userID]) 
    ordersAmount.append(amount)

# Crear el gráfico de barras
plt.figure(figsize=(10, 6))
plt.bar(names, ordersAmount, color='skyblue')
plt.title('QUANTITAT DE COMANDES PER USUARI')
plt.xlabel('Usuari')
plt.ylabel('Quantitat de comandes')
plt.xticks(rotation=45, ha='right')

plt.tight_layout()
plt.savefig('./graphics/quantComand.jpg')

#HORES AMB MÉS COMANDES
dates = [orders['fecha'] for orders in data['Comanda'] if orders['fecha'] is not None]

datesRightFormat = [fecha.replace('/', '').replace(':', '') for fecha in dates]

hours = []

for fecha in datesRightFormat:
    try:
        # Intentar analizar la fecha con varios formatos
        date_object = datetime.strptime(fecha, '%d%m%Y-%H%M')
    except ValueError:
        try:
            date_object = datetime.strptime(fecha, '%d/%m/%Y%-H:%M')
        except ValueError:
            print(f'Formato de fecha no reconocido: {fecha}')
            continue

    hours.append(date_object.hour)

countHours = {hora: hours.count(hora) for hora in set(hours)}

plt.figure(figsize=(10, 6))
plt.bar(countHours.keys(), countHours.values(), color='skyblue')
plt.xlabel('Hora del dia')
plt.ylabel('Quantitat de comandes')
plt.title('Quantitat de comandes per hora')
plt.yticks(range(int(max(countHours.values()) + 1)))  
plt.savefig('./graphics/hores.jpg')