var mysql = require('mysql2');
const fs = require('fs');
const date = new Date();

var express = require("express");
var bodyP = require("body-parser");
var cors = require("cors");
const { deserialize } = require('v8');
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

function selectDBProductes() {
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

function insertDBProductos(nombre, descripcion, precio, imagen_url, stock, estado) {
    let con = conectDB();
    var sql = "INSERT INTO Productos (nombre, descripcion, precio, imagen_url, stock, estado)VALUES ('"+ nombre +"', '"+descripcion+"', "+precio +", '"+imagen_url+"', "+stock+", '"+estado+"');";
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error insert producto");
        } else {
            console.log(result);
        }
    });
}

function updateDBProducto(producto){
    const id = producto.id
    const nombre=producto.nombre
    const descripcion=producto.descripcion
    const precio=producto.precio
    const imagen_url=producto.imagen_url
    const stock=producto.stock
    const estado=producto.estado

    let con = conectDB();
    var sql = "UPDATE Productos SET nombre='"+nombre+"', descripcion='"+descripcion+"', precio="+precio+", imagen_url='"+imagen_url+"', stock="+stock+", estado='"+estado+"' WHERE id="+id;
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error delete producto");
        } else {
            console.log(result);
        }
    });
}


function deleteDBProductos(id){
    let con = conectDB();
    var sql = "DELETE FROM Productos WHERE id="+id;
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error delete producto");
        } else {
            console.log(result);
        }
    });
}

function selectDBUsuarios(){
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = "SELECT * FROM Usuario";
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
app.listen(PORT, () => {
    console.log("SERVER RUNNING " + PORT)
})

app.get("/productos", (req, res) => {
    console.log("GET:: /productos");
    selectDBProductes()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log("error. " + error);
        })
});

app.post("/producto", (req, res) => {
    const producto = req.body;
    console.log(producto);
    const nombre = producto.nombre
    const descripcion = producto.descripcion
    const precio = producto.precio
    const imagen_url = producto.imagen_url
    const stock = producto.stock
    const estado = producto.estado

    
    insertDBProductos(nombre, descripcion, precio, imagen_url, stock, estado)
    res.json(producto)
})

app.delete("/producto/:id",(req, res)=>{
    const id = req.params.id
    deleteDBProductos(id)
    res.json({"id": id})
})

app.post("/productoUpdate", (req, res) => {
    const producto = req.body;
    console.log(producto);
    updateDBProducto(producto)
})

app.get("/usuarios", (req, res)=>{
    console.log("GET:: /Usuarios");
    selectDBUsuarios()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log("error. " + error);
        })
})






