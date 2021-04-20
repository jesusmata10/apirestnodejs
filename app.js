var express = require('express')
var mysql = require('mysql2')

var app = express()

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'jesus',
    password: '17719',
    database: 'articulosdb'
})
connection.connect((error) => {
    if (error) {
        console.log('El error de conexion es : ' + error);
        return;
    }
    console.log('¡Conectado a la base de datos!');
});

app.get('/', (req, res) => {
    res.send('Pagina de inicio')
})

app.listen('3000', () => {
    console.log("Servidor ejecutandose por el PORT:3000")
})
