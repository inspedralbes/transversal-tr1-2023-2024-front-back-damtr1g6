var mysql = require('mysql2');
const fs = require('fs');
const date = new Date();

var express = require("express");
var bodyP = require("body-parser");
var cors = require("cors");
var app = express();
const PORT = 3672;

app.use(cors());
app.use(bodyP.json());
app.use(express.json());

const dbConfig = {
    host: "dam.inspedralbes.cat",
    user: "a22jhepincre_PR1",
    password: "TR1Tienda",
    database: "a22jhepincre_PR1Tienda"
};

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

app.delete("/producto/:id", (req, res) => {
    const id = req.params.id
    deleteDBProductos(id)
    res.json({ "id": id })
})

app.post("/productoUpdate", (req, res) => {
    const producto = req.body;
    console.log(producto);
    updateDBProducto(producto)
})

app.post("/usuarios", (req, res) => {
    console.log("GET:: /Usuarios");
    selectDBUsuarios()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log("error. " + error);
        })
})

app.post("/usuario", (req, res) => {
    console.log("POST:: /Usuario");
    const user = req.body;
    const email = user.email
    const usuario = user.usuario
    const rol = user.rol
    const tarjeta = user.tarjeta
    const passwd = user.passwd

    insertDBUsuario(email, usuario, rol, tarjeta, passwd)
    res.json(user)
})

app.post("/miUsuario", (req, res) => {
    res.json(user)
})

app.post("/createComanda", async (req, res) => {
    const user = req.body;
    const email = user.email;

    let myUser = await selectDBMiUsuario(email);
    insertDBComanda(myUser[0].id)
})

app.post("/addProductCarrito", async (req, res) => {
    const user = req.body;
    const email = user.email;

    let myUser = await selectDBMiUsuario(email);
    insertDBProductCarrito(myUser[0].id)
})

app.listen(PORT, () => {
    console.log("SERVER RUNNING " + PORT)
})

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
        disconnectDB(con);
    });
}

function insertDBProductos(nombre, descripcion, precio, imagen_url, stock, estado) {
    let con = conectDB();
    var sql = "INSERT INTO Productos (nombre, descripcion, precio, imagen_url, stock, estado)VALUES ('" + nombre + "', '" + descripcion + "', " + precio + ", '" + imagen_url + "', " + stock + ", '" + estado + "');";
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error insert producto");
        } else {
            console.log(result);
        }
    });
    disconnectDB(con);
}

function updateDBProducto(producto) {
    const id = producto.id
    const nombre = producto.nombre
    const descripcion = producto.descripcion
    const precio = producto.precio
    const imagen_url = producto.imagen_url
    const stock = producto.stock
    const estado = producto.estado

    let con = conectDB();
    var sql = "UPDATE Productos SET nombre='" + nombre + "', descripcion='" + descripcion + "', precio=" + precio + ", imagen_url='" + imagen_url + "', stock=" + stock + ", estado='" + estado + "' WHERE id=" + id;
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error delete producto");
        } else {
            console.log(result);
        }
    });
    disconnectDB(con);
}


function deleteDBProductos(id) {
    let con = conectDB();
    var sql = "DELETE FROM Productos WHERE id=" + id;
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error delete producto");
        } else {
            console.log(result);
        }
    });
    disconnectDB(con);
}

function selectDBUsuarios() {
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
        disconnectDB(con);
    });
}

function selectDBMiUsuario(email) {
    return new Promise((resolve, reject) => {
        email = "email@gmail.com";
        let con = conectDB();
        var sql = `SELECT * FROM Usuario WHERE email = "${email}"`;

        con.query(sql, function (err, result) {
            if (err) {
                console.log("error");
                reject(err);
            } else {
                disconnectDB(con);
                resolve(result);
            }
        });
    });
}

function insertDBUsuario(email, usuario, rol, tarjeta, passwd) {
    let con = conectDB();
    var sql = "INSERT INTO Usuario (email, usuario, rol, tarjeta, passwd)VALUES ('" + email + "', '" + usuario + "', '" + rol + "', '" + tarjeta + "', '" + passwd + "');";
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error insert producto");
        } else {
            console.log(result);
        }
    });
    disconnectDB(con);
}

function insertDBComanda(id) {
    let con = conectDB();
    var sql = `INSERT INTO Comanda(estado, id_user, comentarios)values("Pending", ${id}, "No comments.")`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    disconnectDB(con);
}

function insertDBProductCarrito(id) {
    // let con = conectDB();
    // var sql = `INSERT INTO Comanda(estado, id_user, comentarios)values("Pending", ${id}, "No comments.")`;
    // con.query(sql, function (err, result) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(result);
    //     }
    // });
    // disconnectDB(con);
}