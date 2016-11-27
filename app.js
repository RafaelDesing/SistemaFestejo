/*
*	Modulos
*/
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var controller = require('./controller/view_controller.js');
/*
*	Configuration body-parser para POST
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser());
/*
*	Routes
*/
app.use(express.static('views'));
/*
*	Inicio de Sesion
*/
app.post('/session/open', controller.session_open);
/*
*	Busca Clientes
*/
app.post('/client/find', controller.client_find);
/*
*	Busca Articulo = nombre
*/
app.post('/articles/findName', controller.bus_articulo_name);
/*
*	Busca Aticulo Codigo
*/
app.post('/article/findCod', controller.bus_articulo_cod);
/*
*	Guarda Aticulo
*/
app.post('/article/save', controller.save_articulo);
/*
*	Lista Aticulo
*/
app.post('/articles/list', controller.list_articulo);
/*
*	Guarda Venta Y Pedido
*/
app.post('/operacion/save', controller.save_operacion);
/*
*	Carga Lista Venta del Dia
*/
app.post('/ventas/listdia', controller.list_venta_dia);
/*
*	Carga Factura Venta
*/
app.post('/ventas/factura', controller.factura_venta);
/*
*	Anula Venta Y Pedido
*/
app.post('/operacion/nulo', controller.anula);
/*
*	Lista de Pedidos Pendientes
*/
app.post('/pedido/listpen', controller.list_pedido_pen);
/*
*	Factura Pedido
*/
app.post('/pedido/fact', controller.fact_send);
/*
*	Pedidos del Mes
*/
app.post('/pedido/mes', controller.pedido_mes);
/*
*	Pedido Abona
*/
app.post('/pedido/abono', controller.abono);
/*
*	Guarda Nuevo Usuario
*/
app.post('/user/save', controller.save_user);
/*
*	Busca Usuario
*/
app.post('/user/find', controller.user_find);
/*
*	Escucha del Servidor
*/
server.listen(8080, function() {
    console.log('SE ACTIVO ESTA MIERDA.!');
});