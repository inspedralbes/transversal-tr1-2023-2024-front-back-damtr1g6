const express = require('express');
var mysql = require('mysql2');
const fs = require('fs');
const date = new Date();
var bodyP = require("body-parser");

const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 3672;
var cors = require('cors')

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

let comandas = [];

async function cargarComandas() {
    comandas = await selectComanda();

    for (let i = 0; i < comandas.length; i++) {
        comandas[i].time = "green";
    }
}

cargarComandas();

io.on('connection', async (socket) => {
    socket.on('getComandas', async (id) => {
        io.emit('comandas', comandas);
    });

    socket.on('changeState', async (comanda) => {
        updateStateDB(comanda.id, comanda.state);
        updateStateComandas(comandas, comanda.id, comanda.state);

        io.emit('comandas', comandas);
    });

    socket.on('deleteComanda', async (id) => {
        deleteComandaDB(id);
        deleteComandaComandas(comandas, id);

        io.emit('comandas', comandas);
    });

    socket.on('disconnect', () => {

    });
});

function updateStateComandas(comandas, idComanda, nuevoEstado) {
    const comandaIndex = comandas.findIndex(comanda => comanda.id_comanda === idComanda);

    comandas[comandaIndex].estado_comanda = nuevoEstado;

    if (nuevoEstado == "PROCESANDO") {
        comandas[comandaIndex].time = "green";
        countTimeComanda(comandas, comandaIndex);
    }

    return comandas;
}

function deleteComandaComandas(comandas, idComanda) {
    const comandaIndex = comandas.findIndex(comanda => comanda.id_comanda === idComanda);

    comandas.splice(comandaIndex, 1);

    return comandas;
}

async function countTimeComanda(comandas, comandaIndex) {
    setTimeout(() => {
        comandas[comandaIndex].time = "yellow";
        io.emit('comandas', comandas);

        setTimeout(() => {
            comandas[comandaIndex].time = "red";
            io.emit('comandas', comandas);
        }, 10000);
    }, 10000);
}

/* --- CERRAR Socket.io --- */

/* --- GESTION DE PRODUCTOS --- */

app.get("/productos", (req, res) => {
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
    updateDBProducto(producto)
})

/* --- CERRAR GESTION DE PRODUCTOS --- */

/* --- GESTION DE USUARIOS --- */

app.post("/usuario", async (req, res) => {
    let email = req.body.email;
    //let email = "email@gmail.com";
    let myUser = await selectDBMiUsuario(email);
    res.send({ "id": myUser[0].id, "username": myUser[0].usuario, "email": myUser[0].email });
})

app.post("/usuario", (req, res) => {
    const user = req.body;
    const email = user.email
    const usuario = user.usuario
    const rol = user.rol
    const tarjeta = user.tarjeta
    const passwd = user.passwd

    insertDBUsuario(email, usuario, rol, tarjeta, passwd)
    res.json(user)
})

app.post("/loginUser", (req, res) => {
    const datos = req.body;
    selectDBUserLogin(datos.usuario, datos.passwd)
        .then((data) => {
            let autorizar = false
            if (data.length > 0) {
                autorizar = true
            }
            res.json({ "autoritzacio": autorizar, "userID": data[0].id })
        })
})

app.post("/miUsuario", (req, res) => {
    res.json(user)
})

/* --- CERRAR GESTION DE USUARIOS --- */

/* --- GESTION DE COMANDAS --- */

app.post("/createComanda", async (req, res) => {
    // let id_user = req.body.id;
    let id_user = 1;
    res.send({ id_comanda: await insertDBComanda(id_user) });
})

/* --- CERRAR GESTION DE COMANDAS --- */

server.listen(PORT, () => {
    console.log("SERVER RUNNING " + PORT)
})

function conectDB() {
    let con = mysql.createConnection(dbConfig)
    con.connect(function (err) {
        if (err) {
            console.log("Error en la conexio");
        }
    })
    return con
}

function disconnectDB(con) {
    con.end(function (err) {
        if (err) {
            return console.log("error: " + err.message);
        }
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
        }
    });
    disconnectDB(con);
}

function selectDBMiUsuario(email) {
    return new Promise((resolve, reject) => {
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

function selectDBUserLogin(user, passwd) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `SELECT * FROM Usuario WHERE usuario="${user}" and passwd="${passwd}"`
        con.query(sql, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result);
                disconnectDB(con);
            }
        })
    })
}

function insertDBUsuario(email, usuario, rol, tarjeta, passwd) {
    let con = conectDB();
    var sql = "INSERT INTO Usuario (email, usuario, rol, tarjeta, passwd)VALUES ('" + email + "', '" + usuario + "', '" + rol + "', '" + tarjeta + "', '" + passwd + "');";
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error insert producto");
        }
    });
    disconnectDB(con);
}

function insertDBComanda(id) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `INSERT INTO Comanda(estado, id_user, comentarios) VALUES("RECIBIDA", ${id}, "No comments.")`;

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                var selectSql = `SELECT C.id_comanda, C.estado_comanda, GROUP_CONCAT(P.nombre) AS productos, SUM(P.precio) AS importe_total
                FROM (
                    SELECT DISTINCT id AS id_comanda, estado AS estado_comanda
                    FROM Comanda WHERE id = ${result.insertId}
                ) AS C
                LEFT JOIN Contiene AS CO ON C.id_comanda = CO.id_comanda
                LEFT JOIN Productos AS P ON CO.id_producto = P.id
                GROUP BY C.id_comanda, C.estado_comanda`;

                con.query(selectSql, function (err, comandaResult) {
                    if (err) {
                        reject(err);
                    } else {
                        comandas.push(comandaResult[0]);
                        io.emit('comandas', comandas);
                        resolve(comandaResult[0].id);
                    }
                });
            }
            disconnectDB(con);
        });
    });
}

function deleteComandaDB(id) {
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

function selectComanda() {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `SELECT C.id_comanda, C.estado_comanda, GROUP_CONCAT(P.nombre) AS productos, SUM(P.precio) AS importe_total
        FROM (
            SELECT DISTINCT id AS id_comanda, estado AS estado_comanda
            FROM Comanda
        ) AS C
        LEFT JOIN Contiene AS CO ON C.id_comanda = CO.id_comanda
        LEFT JOIN Productos AS P ON CO.id_producto = P.id
        GROUP BY C.id_comanda, C.estado_comanda;        
        `;
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

function updateStateDB(id, estado) {
    let con = conectDB();
    var sql = "UPDATE Comanda SET estado='" + estado + "' WHERE id=" + id;
    con.query(sql, function (err, result) {
        if (err) {
            console.log("error update comanda");
        }
    });
    disconnectDB(con);
}