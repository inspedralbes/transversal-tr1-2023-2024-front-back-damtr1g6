var express = require("express");
var mysql = require('mysql2');
const fs = require('fs');
const date = new Date();
const http = require('http');
const path = require('path');

var bodyP = require("body-parser");
var cors = require("cors");
var app = express();
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);

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

/* --- Socket.io --- */

let comandas = selectComanda();

io.on('connection', (socket) => {
    socket.on('getComandas', () => {
        io.emit('comandas', comandas);
    });

    socket.on('finalizarComanda', (id_comanda) => {
        const index = comandas.findIndex(item => item.id == id_comanda);
        comandas[index].estado = "Finalizado";

        changeEstadoComanda(id_comanda, "Finalizado");
        io.emit('comandas', comandas);
    });

    socket.on('disconnect', () => {

    });
});

/* --- CERRAR Socket.io --- */

/* --- GESTION DE PRODUCTOS --- */

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

/* --- CERRAR GESTION DE PRODUCTOS --- */

/* --- GESTION DE USUARIOS --- */

app.post("/usuario", async (req, res) => {
    // let email = req.body.email;
    let email = "email@gmail.com";
    let myUser = await selectDBMiUsuario(email);
    res.send({ "id": myUser[0].id, "username": myUser[0].usuario, "email": myUser[0].email });
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

/* --- CERRAR GESTION DE USUARIOS --- */

/* --- GESTION DE COMANDAS --- */

app.get("/getComandas", async (req, res) => {
    res.send(await selectComanda());
})

app.post("/createComanda", async (req, res) => {
    // let id_user = req.body.id;
    let id_user = 1;
    res.send({ id_comanda: await insertDBComanda(id_user) });
})

app.delete("/deleteComanda", async (req, res) => {
    // let id_comanda = req.body.id;
    let id_comanda = 1;

    res.send({ message: deleteDBComanda(id_comanda) });
})

// app.post("/addProductCarrito", async (req, res) => {
//     // let id_comanda = req.body.id_comanda;
//     // let id_producto = req.body.id_producto;
//     let id_comanda = 1;
//     let id_producto = 2;
//     insertDBProductCarrito(id_comanda, id_producto);
// })

app.post("/buyComanda", async (req, res) => {
    // let id_comanda = req.body.id_comanda;
    // let id_producto = req.body.id_producto;
    let id_comanda = 1;
    changeEstadoComanda(id_comanda, "Procesando");
})

app.post("/finishComanda", async (req, res) => {
    // let id_comanda = req.body.id_comanda;
    // let id_producto = req.body.id_producto;
    let id_comanda = 1;
    changeEstadoComanda(id_comanda, "Finished");
})

/* --- CERRAR GESTION DE COMANDAS --- */

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
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `INSERT INTO Comanda(estado, id_user, comentarios) VALUES("Pendiente", ${id}, "No comments.")`;

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId);
            }
            disconnectDB(con);
        });
    });
}

function deleteDBComanda(id) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `DELETE FROM Comanda WHERE id = ${id}`;

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve("Deleted: " + result);
            }
            disconnectDB(con);
        });
    });
}

// function insertDBProductCarrito(id_comanda, id_producto) {
//     let con = conectDB();
//     var sql = `INSERT INTO Contiene (id_producto, id_comanda) VALUES (${id_producto}, ${id_comanda});`;
//     con.query(sql, function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(result);
//         }
//     });
//     disconnectDB(con);
// }

function selectComanda() {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `SELECT P.id, P.nombre, P.precio, P.stock, P.estado, CM.estado
                    FROM Productos AS P
                    JOIN Contiene AS C ON P.id = C.id_producto
                    JOIN Comanda AS CM ON C.id_comanda = CM.id`;

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

function changeEstadoComanda(id_comanda, estado) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `UPDATE Comanda SET estado = '${estado}' WHERE id = ${id_comanda};`;

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