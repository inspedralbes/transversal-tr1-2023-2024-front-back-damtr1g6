import { socket } from '@/services/socket';

export async function getProductes() {
    const response = await fetch('http://localhost:3672/productos');
    const productos = await response.json();
    return productos;
}

export function getComandes() {
    return new Promise((resolve, reject) => {
        socket.emit('getComandas', {});

        socket.on('comandas', (comandas) => {
            resolve(comandas);
        });
    });
}

export async function addProducte(dadaProducte) {
    console.log("addProducte::datos recibidos: ", dadaProducte, typeof dadesPregunta)
    const response = await fetch(`http://localhost:3672/producto`,
        {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
            body: dadaProducte
        },)
}

export async function updateProducte(dadaProducte) {
    console.log("addProducte::datos recibidos: ", dadaProducte, typeof dadesPregunta)
    const response = await fetch(`http://localhost:3672/productoUpdate`,
        {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
            body: dadaProducte
        },)
}

export async function deleteProducte(id) {
    await fetch('http://localhost:3672/producto/' + id,
        { method: 'DELETE' })
        .then(response => response.json)
}
