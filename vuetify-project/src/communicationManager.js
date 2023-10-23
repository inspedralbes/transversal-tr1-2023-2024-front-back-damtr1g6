export async function getProductes() {
    const response = await fetch('http://localhost:3672/productos');
    const productos = await response.json();
    return productos;
}
