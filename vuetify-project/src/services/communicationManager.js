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
    var formData = new FormData();
    formData.append("id", dadaProducte.id);
    formData.append("nombre", dadaProducte.nombre);
    formData.append("descripcion", dadaProducte.descripcion);
    formData.append("estado", dadaProducte.estado);
    formData.append("precio", dadaProducte.precio);
    formData.append("stock", dadaProducte.stock);
    formData.append("image", dadaProducte.image);

    const response = await fetch(`http://localhost:3672/addProducto`,
        {
            method: 'POST',
            mode: 'cors',
            body: formData
        },)
    
}

export async function updateProducte(dadaProducte) {
    var formData = new FormData();
    formData.append("id", dadaProducte.id);
    formData.append("nombre", dadaProducte.nombre);
    formData.append("descripcion", dadaProducte.descripcion);
    formData.append("estado", dadaProducte.estado);
    formData.append("imagen_url", dadaProducte.imagen_url);
    formData.append("precio", dadaProducte.precio);
    formData.append("stock", dadaProducte.stock);
    formData.append("image", dadaProducte.image);

    const response = await fetch(`http://localhost:3672/updateProducto`, {
        method: 'POST',
        mode: 'cors',
        body: formData,
    });
}

export async function loginUser(user) {
    console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3672/loginUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const usuario = await response.json();
    return usuario;
}

export async function deleteProducte(id) {
    let exist;
    await fetch('http://localhost:3672/deleteProducto/' + id,
        { method: 'DELETE' })
        .then(response => response.json())
        .then(data => exist = data);
    return exist;
}
