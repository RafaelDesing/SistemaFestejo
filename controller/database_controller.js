var pg = require('pg');
var moment = require('moment');
require('es6-promise').polyfill();

// var conf = "postgres://usuario:franco@localhost:5432/SistemaFestejo";
var conf = "postgres://super:ata@localhost:5432/SistemaFestejo";
var connection;

pg.connect(conf, function(err, client, done) {
	connection = client;
});

exports.session_open = function(res, cedula, clave) {
	connection.query('SELECT nombre, grado FROM usuario WHERE cedula = $1 AND clave = $2 LIMIT 1;', [cedula,clave], function(error, result) {
    	valida_param_out(res, error, result);
    });
}

exports.client_find = function(res, cedula) {
	connection.query('SELECT nombre, telefono FROM cliente WHERE cedula = $1 LIMIT 1;', [cedula], function(error, result) {
    	valida_param_out(res, error, result);
    });
}

exports.bus_articulo_name = function(res, nombre) {
	connection.query('SELECT * FROM articulo WHERE descripcion LIKE $1 ORDER BY codigo ASC;', ['%' + nombre + '%'], function(error, result) {
     	valida_param_out(res, error, result);
    });
}

exports.bus_articulo_cod = function(res, codigo) {
	connection.query('SELECT * FROM articulo WHERE codigo = $1 LIMIT 1;', [codigo], function(error, result){
		valida_param_out(res, error, result);
	});
}

exports.save_articulo = function(res, codigo, descripcion, cantidad, precio) {
	connection.query('SELECT * FROM articulo WHERE codigo = $1 LIMIT 1;', [codigo], function(error, result){
		if(result.rowCount == 0){
			connection.query('INSERT INTO articulo VALUES($1,$2,$3,$4);', [codigo,descripcion,cantidad,precio], function(error, result1){
				valida_param_out(res, error, result1);
			});
		} else {
			connection.query('UPDATE articulo SET descripcion = $1, cantidad = $2, precio = $3 WHERE codigo = $4;', [descripcion,cantidad,precio,codigo], function(error, result1){
				valida_param_out(res, error, result1);
			});
		}
	});
}

exports.list_articulo = function(res) {
	connection.query('SELECT * FROM articulo ORDER BY codigo ASC;', function(error, result){
		valida_param_out(res, error, result);
	});
}

function save_cliente(cedula, nombre, telefono) {
	connection.query('SELECT * FROM cliente WHERE cedula = $1 LIMIT 1;', [cedula], function(error, result){
		if(result.rowCount == 0){
			connection.query('INSERT INTO cliente VALUES($1,$2,$3);', [cedula,nombre,telefono]);
		} else {
			connection.query('UPDATE cliente SET nombre = $1, telefono = $2 WHERE cedula = $3;', [nombre,telefono,cedula]);
		}
	});
}

exports.save_operacion = function(res, cedula, nombre, telefono, fecha_pedido, fecha_out, fecha_venta, obj, estado) {
	save_cliente(cedula, nombre, telefono);
	var fecha = moment().format('YYYY-MM-DD');
	fecha_out = moment(fecha_out,'DD/MM/YYYY').format('YYYY-MM-DD');
	if(estado == 'venta') {
		fecha_venta = fecha;
		fecha_pedido = null;
		fecha_out = null;
	} else {
		fecha_pedido = fecha;
		fecha_venta = null;
	}
	connection.query('INSERT INTO operacion(cedula,fecha_pedido,fecha_out,estado,fecha_venta) VALUES($1,$2,$3,$4,$5) RETURNING id;', [cedula,fecha_pedido,fecha_out,estado,fecha_venta], function(error, result) {
		var id = result.rows[0]["id"];
		for (var i = 0; i < obj.length; i++) {
			connection.query('INSERT INTO detalle(operacion_id,codigo,cantidad,precio) VALUES($1,$2,$3,$4);', [id,obj[i].codigo,obj[i].cantidad,obj[i].precio]);
			connection.query('UPDATE articulo SET cantidad = (cantidad - $1) WHERE codigo = $2;', [obj[i].cantidad,obj[i].codigo]);
		}
		valida_param_out(res, error, result);
	});
}

exports.list_venta_dia = function(res, dia) {
	dia = moment(dia, 'DD/MM/YYYY').format('YYYY-MM-DD');
	connection.query('SELECT cliente.nombre || \'<br>\' || cliente.cedula AS cliente, SUM(detalle.precio) AS total, operacion.id, operacion.estado, operacion.abono_new FROM public.operacion, public.cliente, public.detalle WHERE operacion.cedula = cliente.cedula AND operacion.id = detalle.operacion_id AND (operacion.fecha_venta = $1 OR operacion.fecha_abono = $1) GROUP BY cliente.nombre, cliente.cedula, operacion.id;', [dia], function(error, result){
		valida_param_out(res, error, result);
	});
}

exports.factura_venta = function(res, id) {
	connection.query('SELECT cliente.cedula, cliente.nombre, cliente.telefono, to_char(operacion.fecha_venta,\'DD/MM/YYYY\') AS fecha_venta, to_char(operacion.fecha_pedido,\'DD/MM/YYYY\') AS fecha_pedido, to_char(operacion.fecha_out,\'DD/MM/YYYY\') AS fecha_out, operacion.abono, to_char(operacion.fecha_abono,\'DD/MM/YYYY\') AS fecha_abono, operacion.estado FROM public.operacion, public.cliente WHERE operacion.id = $1 AND operacion.cedula = cliente.cedula;', [id], function(error, result){
		connection.query('SELECT detalle.cantidad, articulo.descripcion, detalle.precio FROM public.detalle, public.articulo WHERE detalle.operacion_id = $1 AND detalle.codigo = articulo.codigo;', [id], function(error, result1){
			result.rows[1] = result1.rows;
			valida_param_out(res, error, result);
		});
	});
}

exports.anula = function(res, id) {
	connection.query('UPDATE operacion SET estado = \'nulo-\' || estado WHERE id = $1;', [id]);
	connection.query('SELECT * FROM detalle WHERE operacion_id = $1;', [id], function(error, result){
		for(i=0; result.rowCount>i; i++) {
			connection.query('UPDATE articulo SET cantidad = cantidad + $1 WHERE codigo = $2;',[result.rows[i]["cantidad"],result.rows[i]["codigo"]]);
		}
		valida_param_out(res, error, result);
	});
}

exports.list_pedido_pen = function(res) {
	connection.query('SELECT cliente.nombre || \'<br>\' || cliente.cedula AS cliente, SUM(detalle.precio) - operacion.abono AS total, operacion.id, operacion.estado FROM public.operacion, public.cliente, public.detalle WHERE operacion.cedula = cliente.cedula AND operacion.id = detalle.operacion_id AND operacion.estado = \'pedido\' GROUP BY cliente.nombre, cliente.cedula, operacion.id, operacion.estado;', function(error, result){
		valida_param_out(res, error, result);
	});
}

exports.fact_send = function(res, id) {
	var fecha = moment().format('YYYY-MM-DD');
	connection.query('UPDATE operacion SET fecha_venta = $1, estado = \'pedido-venta\' WHERE id = $2;', [fecha,id], function(error, result){
		console.log('\n\n'+error+'\n\n');
		res.status(200).send("Ok");
	});
}

exports.pedido_mes = function(res, mes) {
	month = moment(mes, 'DD/MM/YYYY').format('MM');
	year = moment(mes, 'DD/MM/YYYY').format('YYYY');
	connection.query('SELECT cliente.nombre || \'<br>\' || cliente.cedula AS cliente, SUM(detalle.precio) AS total, operacion.id, operacion.estado FROM public.operacion, public.cliente, public.detalle WHERE operacion.cedula = cliente.cedula AND operacion.id = detalle.operacion_id AND $1 = date_part(\'year\', operacion.fecha_pedido) AND $2 = date_part(\'month\', operacion.fecha_pedido) AND (operacion.estado = \'pedido\' OR operacion.estado = \'pedido-venta\' OR operacion.estado = \'nulo-pedido\' OR operacion.estado = \'nulo-pedido-venta\') GROUP BY cliente.nombre, cliente.cedula, operacion.id, operacion.estado;', [year,month], function(error, result){
		valida_param_out(res, error, result);
	});
}

exports.abono = function(res, id, valor) {
	var fecha = moment().format('YYYY-MM-DD');
	connection.query('UPDATE operacion SET abono = abono + $1, abono_new = $1, fecha_abono = $2 WHERE id = $3;',[valor,fecha,id], function(error, result){
		valida_param_out(res, error, result);
	});
}

exports.save_user = function(res, cedula, nombre, grado, clave) {
	connection.query('SELECT * FROM usuario WHERE cedula = $1 LIMIT 1;', [cedula], function(error, result){
		if(result.rowCount == 0){
			connection.query('INSERT INTO cliente VALUES($1,$2,$3,$4);', [cedula,nombre,clave,grado], function(error, result){
					if(!error)
						res.status(200).send("Ok");
					else
						res.status(200).send("error");
			});
		} else {
			connection.query('UPDATE cliente SET nombre = $1, clave = $2, grado = $3 WHERE cedula = $4;', [nombre,clave,grado,cedula], function(error, result){
					if(!error)
						res.status(200).send("Ok");
					else
						res.status(200).send("error");
			});
		}
	});
}

exports.user_find = function(res, cedula) {
	connection.query('SELECT nombre, grado FROM usuario WHERE cedula = $1 LIMIT 1;', [cedula], function(error, result) {
    	valida_param_out(res, error, result);
    });
}

function valida_param_out(res, error, result) {
	if(!error){
		// console.log('\n\n'+JSON.stringify(result.rows, null, ' ')+'\n\n');
		if(result.rowCount > 0){
			res.status(200).send(result.rows);
		} else {
			res.status(200).send(false);
		}
	} else {
		res.status(200).send('error');
		console.log(error);
	}
}