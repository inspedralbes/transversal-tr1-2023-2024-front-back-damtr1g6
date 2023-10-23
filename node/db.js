var mysql = require('mysql2');
const fs = require('fs');
const date = new Date();

var express = require("express");
var bodyP = require("body-parser");
var cors = require("cors");
var app = express()
const PORT = 3672


app.use(cors());
app.use(bodyP.json());
app.use(express.json());

const dbConfig = {
    host: "dam.inspedralbes.cat",
    user: "a22jhepincre_PR1",
    password: "TR1Tienda",
    database: "a22jhepincre_PR1Tienda"
};

app.listen(PORT, () => {
    console.log("SERVER RUNNING " + PORT)
})

app.get("/productos", (req, res) => {
    console.log("GET:: /productos");
    selectDB()
        .then((data) => {
            const productos = [];
            productos.push(...data)
            console.log(productos);
            res.json(productos);
        })
        .catch((error) => {
            console.log("error. " + error);
        })
});



function conectDB() {
    let con = mysql.createConnection(dbConfig)
    con.connect(function (err) {
        if (err) {
            console.log("No conexio");
        } else {
            console.log("Conectado");
        }
    })
    return con
}

function disconnectDB(con) {
    con.end(function (err) {
        if (err) {
            return console.log("error: " + err.message);
        }
        console.log("Se cierra la coneccion.");
    })
}

function selectDB() {
    return new Promise((resolve, reject) => {
        let con = conectDB();
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



