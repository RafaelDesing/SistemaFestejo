var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser());

app.use(express.static('public'));

var sesion = require('./modulos/sesion.js')
var mongo = require('./modulos/mongo.js');
/*
*   ENTRADA AL SISTEMA
*/
app.post('/sing',sesion.start);
/*
*   COMPROVACION DEL SUPER-USUARIO
*/
mongo.Root();
/*
*   REGISTRO Y EDICION DE ARTICULO
*/
app.post('/sendF2',mongo.inupArti);
/*
*   BUSCA ARTICULO POR DESCRIPCION
*/
app.post('/findArtDesc',mongo.buscaArtiDesc);
/*
*   BUSCA ARTICULO POR DESCRIPCION
*/
app.post('/findArtCod',mongo.buscaArtiCod);
/*
*   LISTA TODOS LOS ARTICULOS
*/
app.post('/findArtAll',mongo.ArtiAll);
/*
*   BUSCA USUARIOS
*/
app.post('/findUser',mongo.findUser);
/*
*   REGISTRO Y EDICION DE USUARIO
*/
app.post('/sendF3',mongo.inupUser);
/*
*   REGISTRO DE VENTAS Y PEDIDOS JUNTO A CLIENTE
*/
app.post('/sendF1',mongo.ingreOp);
/*
*   BUSQUEDA DE CLIENTE
*/
app.post('/findCli',mongo.findCli);
/*
*   LISTA VENTA DEL DIA
*/
app.post('/findLvd',mongo.findLvd);
/*
*   LISTA DE PEDIDOS DEL MES
*/
app.post('/findLpm',mongo.findLpm);
/*
*   LISTA DE PEDIDOS PENDIENTES
*/
app.post('/findLpp',mongo.findLpp);
/*
*   ANULA VENTA
*/
app.post('/anulVen',mongo.anulVen);
/*
*   ANULA PEDIDO
*/
app.post('/anulPedido',mongo.anulPedido);
/*
*   FACTURA LA VENTA DE UN PEDIDO
*/
app.post('/factPedido',mongo.factPedido);
/*
*   REGISTRA EL ABONO DE UN PEDIDO
*/
app.post('/abonoPedido',mongo.abonoPedido);
/*
*   PUESTA EN MARCHA DEL SERVIDOR
*/
server.listen(8080, function() {
    console.log('SE ACTIVO ESTA MIERDA.!');
});
