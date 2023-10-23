var mysql = require('mysql2');
const fs = require('fs');
const date = new Date();

var con = mysql.createConnection({
    host: "dam.inspedralbes.cat",
    user: "a22jhepincre_PR1",
    password: "TR1Tienda",
    database: "a22jhepincre_PR1Tienda"
})

function conectarBD() {
    con.connect(function (err) {
        if (err) {
            console.log("No conexio");
        } else {
            console.log("Conectado");
        }
    })
}

function cerrarConexion() {
    con.end(function (err) {
        if (err) {
            return console.log("error: " + err.message);
        }
        console.log("Se cierra la coneccion.");
    })
}

conectarBD()
cerrarConexion()