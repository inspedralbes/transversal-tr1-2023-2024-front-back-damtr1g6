export async function getProductes() {
    const response = await fetch('http://localhost:3000/productos');
    const preguntas = await response.json();
    return preguntas;
}
