const express = require('express');
var mysql = require('mysql2');
var mysqlP = require('mysql2/promise');
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
app.use(cors());
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

    socket.on('getComandaByID', async (id) => {
        selectComandaByID(id)
        .then(data =>{
            var result = [];
            data.forEach(element => {
                if(element.productos != null){
                element.productos = desconcatenador(element)
                }
            });
            data = data.filter(comanda => comanda.estado_comanda == 'Recollida')
            for(let i = data.length-1 ; i > data.length-11; i--){
                if(data[i] != undefined){
                    result.push(data[i]);
                }
            }
            console.log(result);
            io.emit('comanda', result);
        })
        
    })

    socket.on('getComandaByIDInProcess', async (id) => {
        selectComandaByID(id)
        .then(data =>{
            data.forEach(element => {
                if(element.productos != null){
                element.productos = desconcatenador(element)
                }
            });
            data = data.filter(comanda => comanda.estado_comanda == 'Processant')
            io.emit('comanda', data)
        })
        
    })

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
        countTimeComanda(comandas, idComanda);
    }

    return comandas;
}

function deleteComandaComandas(comandas, idComanda) {
    const comandaIndex = comandas.findIndex(comanda => comanda.id_comanda === idComanda);

    comandas.splice(comandaIndex, 1);

    return comandas;
}

async function countTimeComanda(comandas, idComanda) {
    setTimeout(() => {
        const comandaIndex = comandas.findIndex(comanda => comanda.id_comanda === idComanda);
        comandas[comandaIndex].time = "yellow";
        reordenarComandas(comandas);
        io.emit('comandas', comandas);

        setTimeout(() => {
            const comandaIndex = comandas.findIndex(comanda => comanda.id_comanda === idComanda);
        comandas[comandaIndex].time = "red";
            reordenarComandas(comandas);
            io.emit('comandas', comandas);
        }, 10000);
    }, 10000);
    
}

function reordenarComandas(comandas) {
    comandas.sort((a, b) => {
        if (a.time === "red") {
            return -1;
        }
        if (b.time === "red") {
            return 1;
        }
        if (a.time === "yellow") {
            return -1;
        }
        if (b.time === "yellow") {
            return 1;
        }
        return 0;
    });
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
    try {
        let producto = req.body;
        let nameImage;

        if (req.file == undefined) {
            nameImage = "a.jpg";
        } else {
            nameImage = req.file.filename;
        }

        await insertDBProductos(producto.nombre, producto.descripcion, producto.precio, nameImage, producto.stock, producto.estado);
        await cargarProductos();
        io.emit('productes', productos);
        res.json(producto);
    } catch (error) {
        res.json({ message: "error" });
    }
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
    console.log(datos);
    selectDBUserLogin(datos.usuario, datos.passwd)
        .then((data) => {
            let autorizar = false
            if (data.length > 0) {
                autorizar = true
            }
            res.json({ "autoritzacio": autorizar, "userID": data[0].id, "rol": data[0].rol })
        })
})

app.post("/miUsuario", (req, res) => {
    res.json(user)
})

app.get('/usuarioID/:id', (req, res) => {
    const userId = req.params.id;
    selectDBUserID(userId)
        .then(result => {
            if (result.length > 0) {
                res.json(result);
            } else {
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        });
});


/* --- CERRAR GESTION DE USUARIOS --- */

/* --- GESTION DE COMANDAS --- */

app.post("/createComanda", async (req, res) => {
    let id_user = req.body.id_user;
    let fecha = req.body.fecha;
    res.send({ id_comanda: await insertDBComanda(id_user, fecha) });
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

app.get('/comandaID/:id_user', (req, res) => {
    console.log("aaaaaaaaa");
    const comandaID = req.params.id_user;
    console.log(req.params.id_user);
    selectComandaByID(comandaID)
        .then(result => {
            console.log(result);
            if (result.length > 0) {
                // console.log(result);
                // result.forEach(comanda => {
                //     var productos = desconcatenador(comanda.productos);
                //     comanda.producto = productos;
                //     console.log(comanda);
                // });
            } else {
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        });
    res.json(productos)
});

/* --- CERRAR GESTION DE COMANDAS --- */

/* --- GESTION DE IMAGENES --- */

app.get("/api/images/:name", (req, res) => {
    res.sendFile(path.resolve("./images/" + req.params.name));
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

/* --- CERRAR GESTION DE IMAGENES --- */

server.listen(PORT, () => {
    console.log("SERVER RUNNING " + PORT)
})

function conectDB() {
    let con = mysql.createConnection(dbConfig);
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

function selectDBUserID(id) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `SELECT * FROM Usuario WHERE id="${id}"`
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

function selectComandaByID(id_user) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `SELECT CD.id_comanda, CD.estado_comanda GROUP_CONCAT("(", CO.cantidad, ")", P.nombre, "-", P.precio) AS productos
        FROM (
            SELECT DISTINCT id AS id_comanda, estado AS estado_comanda
            FROM Comanda
            WHERE id_user = ${id_user}
        ) AS CD
        LEFT JOIN Contiene AS CO ON CD.id_comanda = CO.id_comanda
        LEFT JOIN Productos AS P ON CO.id_producto = P.id
        GROUP BY CD.id_comanda, CD.estado_comanda;`
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
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

function insertDBComanda(id, fecha) {
    return new Promise((resolve, reject) => {
        let con = conectDB();
        var sql = `INSERT INTO Comanda(estado, id_user, comentarios, fecha) VALUES("Rebuda", ${id}, "No comments.", "${fecha}")`;

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

const rutaArxiu = path.join(__dirname, 'informacio');;
const nomArxiu = `${rutaArxiu}/dades.json`;

async function getData() {
    try {
        const con = await mysqlP.createConnection(dbConfig);

        const [usuariosRows] = await con.query('SELECT * FROM Usuario');
        const [productosRows] = await con.query('SELECT * FROM Productos');
        const [comandaRows] = await con.query('SELECT * FROM Comanda');
        const [contieneRows] = await con.query('SELECT * FROM Contiene');

        const datos = {
            Usuarios: usuariosRows,
            Productos: productosRows,
            Comanda: comandaRows,
            Contiene: contieneRows
        };

        if (!fs.existsSync(rutaArxiu)) {
            fs.mkdirSync(rutaArxiu);
        }

        fs.writeFile(nomArxiu, JSON.stringify(datos), (err) => {
            if (err) {
                console.error('Error al guardar los datos:', err);
            } else {
                console.log('Datos guardados en', nomArxiu);
            }
        });

        await con.end();

    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error;
    }
}

//Cada 1 min, llama a la función, para mantener actualizado el json
const interval = 60 * 1000;
setInterval(getData, interval);

getData();


//Esta función lo que hace es revisar si hay cambios en la bbdd y lo actualiza en el json
async function vigilanteBaseDatos() {
    const con = await mysqlP.createConnection(dbConfig);

    con.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return;
        }

        con.query('SELECT 1', (err) => {
            if (err) {
                console.error('Error al hacer una consulta a la base de datos:', err);
                return;
            }

            //"Salta la alarma" volvemos a cargar la base de datos
            con.on('change', (table, changes) => {
                getData();
            });
        });
    });


}


//Para que se ejecuten las graficas
function generateGraph() {
    vigilanteBaseDatos();
    return new Promise((resolve, reject) => {
        var { spawn } = require("child_process");
        var proceso = spawn("Python", ["./stats.py"]);

        proceso.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                console.error(
                    `${code}`
                );
                reject(
                    `${code}`
                );
            }
        });
    });
}

app.use('/graphics', express.static(path.join(__dirname, 'graphics')));
app.get('/graphics', async (req, res) => {
    
    try {
        await getData();
    const images = [
        'http://localhost:3672/graphics/estatComandes.jpg', 
        'http://localhost:3672/graphics/estatProd.jpg', 
        'http://localhost:3672/graphics/prodVSvendida.jpg', 
        'http://localhost:3672/graphics/quantComand.jpg', 
        'http://localhost:3672/graphics/quantProd.jpg', 
        'http://localhost:3672/graphics/stock.jpg',
        'http://localhost:3672/graphics/hores.jpg' ];
    res.json(images);
    } catch{
        console.error("Error al generar les gràfiques:", error);        
    }
});