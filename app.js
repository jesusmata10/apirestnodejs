var express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql2');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dotenv = require('dotenv');
dotenv.config({ 
    path: './env/.env'
});

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


connection.connect((error) => {
    if (error) {
        console.log('El error de conexion es : ' + error);
        return;
    }
    console.log('¡Conectado a la base de datos!');
});

app.get('/', (req, res) => {
    res.send('Pagina de inicio');
})

app.get('/api/articulos', (req, res) => {
    connection.query('SELECT * FROM articulos', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    })
})

app.get('/api/articulos/:id', (req, res) => {
    var id = req.params.id;
    connection.query('SELECT * FROM articulos WHERE id = ?', [id], (error, filas) => {
        if (error) {
            throw error;
        } else {
            if (filas != 0) {
                res.send(filas)
            } else {
                res.send('no hay dato registrado con ese id')
            }

        }

    })
})

app.post('/api/articulos', (req, res) => {
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const stock = req.body.stock;
    //const contentType = req.headers['content-type'];
    console.log(req.body);
    connection.query('INSERT INTO articulos SET ?', { descripcion: descripcion, precio: precio, stock: stock }, (error, results) => {
        if (error) {
            console.log("Ha ocurrido un error: "+error);
        } else {
            res.json({
            	datos: 'Registro guardado con exito'
            })
        }
    })
})


/*app.post('api/articulos', (req, res) => {
    var data = {
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock
    };
    var sql = "INSERT INTO articulos SET ?";
    console.log(dato);
    connection.query(sql, data, function(error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
            console.log(results)
        }
    })
})*/

app.put('/api/articulos/:id', (req, res) =>{
	var id = req.body.id;
	var descripcion = req.body.descripcion;
	var precio = req.body.precio;
	var stock = req.body.stock;
	var sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
	connection.query(sql, [descripcion, precio, stock, id], function(error, results){
		if (error) {
			throw error;
		} else{
			res.send(results);
		}
	})
})

app.delete('/api/articulos/:id', (req,res) => {
	var id = req.params.id;
	console.log(id)
	connection.query("DELETE FROM articulos WHERE id = ?", [id], (error, results)=>{
		if (error) {
			throw error;
		} else {
			res.send(results);
		}
	})
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor ejecutandose por el PORT: "+port)
})
