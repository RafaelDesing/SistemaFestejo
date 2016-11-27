var db = require('./database_controller.js');

exports.session_open = function(req, res) {
	db.session_open(res,
		req.body.cedula,
		req.body.clave
		);
}

exports.client_find = function(req, res) {
	db.client_find(res, req.body.cedula)
}

exports.bus_articulo_name = function(req, res) {
	db.bus_articulo_name(res, req.body.nombre)
}

exports.bus_articulo_cod = function(req, res) {
	db.bus_articulo_cod(res, req.body.codigo);
}

exports.save_articulo = function(req, res) {
	db.save_articulo(res,
		req.body.codigo,
		req.body.descripcion,
		req.body.cantidad,
		req.body.precio
		);
}

exports.list_articulo = function(req, res) {
	db.list_articulo(res);
}

exports.save_operacion = function(req, res) {
	db.save_operacion(
			res,
			req.body.cedula,
			req.body.nombre,
			req.body.telefono,
			req.body.fecha_pedido,
			req.body.fecha_out,
			req.body.fecha_venta,
			req.body.obj,
			req.body.estado
		);
}

exports.list_venta_dia = function(req, res) {
	db.list_venta_dia(res, req.body.dia);
}

exports.factura_venta = function(req, res) {
	db.factura_venta(res, req.body.id);
}

exports.anula = function(req, res) {
	db.anula(res, req.body.id);
}

exports.list_pedido_pen = function(req, res) {
	db.list_pedido_pen(res);
}

exports.fact_send = function(req, res) {
	db.fact_send(res, req.body.id);
}

exports.pedido_mes = function(req, res) {
	db.pedido_mes(res, req.body.mes);
}

exports.abono = function(req, res) {
	db.abono(res,
		req.body.id,
		req.body.valor
		);
}

exports.save_user = function(req, res) {
	db.save_user(res,
		req.body.cedula,
		req.body.nombre,
		req.body.grado,
		req.body.clave
		);
}

exports.user_find = function(req, res) {
	db.user_find(res,
		req.body.cedula
		);
}