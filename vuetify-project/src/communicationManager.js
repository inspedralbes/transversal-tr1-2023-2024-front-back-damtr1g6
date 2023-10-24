export async function getProductes() {
    const response = await fetch('http://localhost:3672/productos');
    const productos = await response.json();
    return productos;
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
