const express = require('express');
var mysql = require('mysql2');
const fs = require('fs');
const multer = require('multer');
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
var cors = require('cors');
const { rejects } = require('assert');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

if (!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
}

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: "dam.inspedralbes.cat",
    user: "a22jhepincre_PR1",
    password: "TR1Tienda",
    database: "a22jhepincre_PR1Tienda"
};

/* --- Socket.io --- */

let comandas = [];

cargarComandas();

let productos = [];

cargarProductos();

async function cargarProductos() {
    productos = await selectDBProductes();
    console.log(productos);
}

async function cargarComandas() {
    comandas = await selectComanda();
    comandas.forEach(comanda => {
        if (comanda.productos != null) {
            var productos = comanda.productos.split(",");
            var productosPrecio = []
            productos.forEach(producto => {
                productosPrecio.push(producto.split("-"));
            });
            var res = []
            productosPrecio.forEach(p => {
                var pr = {
                    nombre: p[0],
                    precio: p[1]
                }
                res.push(pr)
            });

            comanda.productos = res;
        }

    })

    for (let i = 0; i < comandas.length; i++) {
        comandas[i].time = "green";
    }
}

io.on('connection', async (socket) => {
    socket.on('getComandas', async (id) => {
        io.emit('comandas', comandas);
    });

    socket.on('getProductes', async (id) => {
        io.emit('productes', productos);
    });

    socket.on('changeStateProducte', async (producto) => {
        updateDBProducto(producto);
        updateStateProducte(productos, producto);
        io.emit('productes', productos)
    })

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

function updateStateProducte(productes, producte) {
    var indexProducte = productes.findIndex(producto => producto.id === producte.id)

    productes[indexProducte].estado = producte.estado;
}

function updateStateComandas(comandas, idComanda, nuevoEstado) {
    const comandaIndex = comandas.findIndex(comanda => comanda.id_comanda === idComanda);

    comandas[comandaIndex].estado_comanda = nuevoEstado;

    if (nuevoEstado == "Processant") {
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

app.post("/addProducto", upload.single('image'), async (req, res) => {
    let producto = req.body;

    await insertDBProductos(producto.nombre, producto.descripcion, producto.precio, req.file.filename, producto.stock, producto.estado);
    await cargarProductos();
    io.emit('productes', productos);
    res.json(producto);
});

app.post('/updateProducto', upload.single('image'), async (req, res) => {
    let producto = req.body;

    if (req.file != undefined) {
        if (req.file.filename != req.body.imagen_url) {
            const imagePath = `images/${req.body.imagen_url}`;
            try {
                fs.unlinkSync(imagePath);
            } catch (err) {
                console.log(err);
            }

            producto.imagen_url = req.file.filename;
        }
    }

    await updateDBProducto(producto);
    await cargarProductos();
    io.emit('productes', productos)
    res.send({ "message": "Producto actualizado" });
});

app.delete("/deleteProducto/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const success = await deleteDBProductos(id);
        await cargarProductos();
        io.emit('productes', productos);
        if (success) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        res.send(false);
    }
});

/* --- CERRAR GESTION DE PRODUCTOS --- */

/* --- GESTION DE USUARIOS --- */

app.post("/usuario", async (req, res) => {
    let email = req.body.email;
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
    let id_user = req.body.id_user;
    res.send({ id_comanda: await insertDBComanda(id_user) });
})

app.post("/insertProducte", async (req, res) => {
    const productos = req.body;
    const promesas = [];

    const procesarProductos = async () => {
        for (const element of productos) {
            try {
                const insertResult = await insertProductDBComanda(element.idProducto, element.cantidad, element.idComanda);
                const productoEliminarStock = await selectDBProducteID(element.idProducto);
                productoEliminarStock[0].stock -= element.cantidad;
                const updateResult = await updateDBProducto(productoEliminarStock[0]);
                promesas.push(insertResult, updateResult);
            } catch (error) {
                console.error(error);
            }
        }

        await Promise.all(promesas);

        try {
            await selectProductsComanda(productos[0].idComanda);
            io.emit('comandas', comandas);
            res.json(productos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al seleccionar productos de la comanda' });
        }
    };

    procesarProductos();
})
/* --- CERRAR GESTION DE COMANDAS --- */

/* --- GESTION DE IMAGENES --- */

app.get("/api/images/:name", (req, res) => {
    res.sendFile(path.resolve("./images/" + req.params.name));
})

/* --- CERRAR GESTION DE IMAGENES --- */

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

function selectDBProducteID(id) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = "SELECT * FROM Productos WHERE id= " + id;
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
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = "INSERT INTO Productos (nombre, descripcion, precio, imagen_url, stock, estado)VALUES ('" + nombre + "', '" + descripcion + "', " + precio + ", '" + imagen_url + "', " + stock + ", '" + estado + "');";
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

function updateDBProducto(producto) {
    return new Promise((resolve, reject) => {
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
                reject(err);
            } else {
                resolve(result);
            }
        });
        disconnectDB(con);
    });
}


function deleteDBProductos(id) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = "DELETE FROM Productos WHERE id=" + id;

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
        disconnectDB(con);
    });
}

function selectDBMiUsuario(email) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `SELECT * FROM Usuario WHERE email = "${email}"`;

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

function selectDBUserLogin(user, passwd) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `SELECT * FROM Usuario WHERE usuario="${user}" and passwd="${passwd}"`
        con.query(sql, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        })
        disconnectDB(con);
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

function insertProductDBComanda(idProducto, cantidad, idComanda) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `INSERT INTO Contiene(id_producto, cantidad, id_comanda) VALUES(${idProducto},${cantidad},${idComanda} )`;

        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve();
            }
            disconnectDB(con);
        });
    });
}

function selectProductsComanda(idComanda) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var selectSql = `SELECT GROUP_CONCAT("(",CO.cantidad , ")",P.nombre, "-",P.precio) AS productos, SUM(P.precio*CO.cantidad) AS importe_total, SUM(CO.cantidad) AS productos_total
                FROM (
                    SELECT DISTINCT id AS id_comanda, estado AS estado_comanda
                    FROM Comanda WHERE id = ${idComanda}
                ) AS C
                LEFT JOIN Contiene AS CO ON C.id_comanda = CO.id_comanda
                LEFT JOIN Productos AS P ON CO.id_producto = P.id
                GROUP BY C.id_comanda, C.estado_comanda`;

        con.query(selectSql, async function (err, result) {
            if (err) {
                reject(err);
            } else {
                let comandaEncontrada = comandas.findIndex(comanda => comanda.id_comanda == idComanda);
                comandas[comandaEncontrada].productos = desconcatenador(result[0]);
                resolve(result);
            }
            disconnectDB(con);
        });
    });
}

function desconcatenador(productos) {
    var arrayProductos = productos.productos.split(",");
    var productosPrecio = [];
    arrayProductos.forEach(producto => {
        productosPrecio.push(producto.split("-"));
    });
    var res = []
    productosPrecio.forEach(p => {
        var pr = {
            nombre: p[0],
            precio: p[1]
        }
        res.push(pr)
    });

    return res;
}

function insertDBComanda(id) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `INSERT INTO Comanda(estado, id_user, comentarios) VALUES("Rebuda", ${id}, "No comments.")`;

        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                var selectSql = `SELECT C.id_comanda, C.estado_comanda, GROUP_CONCAT(P.nombre) AS productos, SUM(P.precio*cantidad) AS importe_total
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
                        resolve(comandaResult[0].id_comanda);
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
        var sql = `SELECT C.id_comanda, C.estado_comanda, GROUP_CONCAT("(",CO.cantidad , ")",P.nombre, "-",P.precio) AS productos, SUM(P.precio*CO.cantidad) AS importe_total, SUM(CO.cantidad) AS productos_total
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