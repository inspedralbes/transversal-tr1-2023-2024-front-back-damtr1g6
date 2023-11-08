//var mysql = require('mysql2');
const fs = require('fs');
const date = new Date();
const path = require('path');
const mysql = require('mysql2/promise');

var express = require("express");
var bodyP = require("body-parser");
var cors = require("cors");
const { log } = require('console');
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

//const directoriInformacio = './informacio';
const directoriInformacio = path.join(__dirname, 'informacio');


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

app.post("/createComanda", async (req, res) => {
    // let id = req.body.id;
    let id = 1;
    insertDBComanda(id)
})

app.post("/addProductCarrito", async (req, res) => {
    // let id = req.body.id;
    let id = 1;
    insertDBProductCarrito(id);
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

const rutaArxiu = path.join(__dirname, 'informacio');;
const nomArxiu = `${rutaArxiu}/dades.json`;

async function getData() {

    try {
        const con = await mysql.createConnection(dbConfig);

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
    const con = await mysql.createConnection(dbConfig);

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

vigilanteBaseDatos();

//Llamar al archivo python
function graficos(){
    return new Promise((resolve,reject) => {
        var { spawn } = require("child_process");
        var proceso = spawn("Python",["./stats.py"]);

        proceso.on("close", (code) => {
            if(code === 0){
                resolve();
            }else {
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


app.get("/estadisticas", async (req, res) => {
    await graficos();

    // Define un array de objetos que representan las imágenes
    const images = [
        { id: 1, url: '/informes/estatComandes.jpg' },
        { id: 2, url: '/informes/estatProd.jpg' },
        { id: 3, url: '/informes/prodVSvendida.jpg' },
        { id: 4, url: '/informes/quantComand.jpg' },
        { id: 5, url: '/informes/quantProd.jpg' },
        { id: 6, url: '/informes/stock.jpg' },
    ];

    // Devuelve el array de objetos como JSON en la respuesta
    res.json({ images });
    console.log("Rutas de imágenes enviadas: ", images); // Agregar un log aquí

    console.log("a")
});





