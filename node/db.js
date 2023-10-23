var mysql = require('mysql2');
const fs = require('fs');
var express = require("express");
var bodyP = require("body-parser");
var cors = require("cors");
var app = express()
const PORT = 3000


app.use(cors());
app.use(bodyP.json());
app.use(express.json());
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

function selectDB() {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM Productos";
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.get("/productos", (req, res) => {
    console.log("GET:: /productos");
    try {
        conectarBD();
        selectDB()
        .then((data)=>{
            const productos = data;
            console.log(productos);
            res.json(productos);
        })
        cerrarConexion();
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.listen(PORT, () => {
    console.log("SERVER RUNNING " + PORT)
})
