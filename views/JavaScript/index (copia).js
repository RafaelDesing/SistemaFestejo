jQuery.fn.reset = function () {
  $(this).each (function() { this.reset(); });
}
/*
*	Variables y Constantes
*/
var obj_in = []
var obj = []
var cont = 0;
var Tprecio = 0;
/*
*	Inicio de Sesion
*/
function session_open(cedula, clave) {
	$.post('/session/open', {
		cedula: cedula,
		clave: clave
	}).done(function(result){
		switch(result) {
			case 'error':
				alert("Error Fatal.!");
			break;
			case false:
				$('body > article em').css('display','block');
			break;
			default:
				$('body > header > nav > div > ul.nav.navbar-right > li').text(result[0]["nombre"])
				$('body > header > nav > div > ul.nav.navbar-right > input#grado').val(result[0]["grado"])
				$('body > article').css('display','none');
				$('body > main').removeClass('nav_none');
			break;
		}
	});
}
/*
*	Click Boton Cancelar
*/
function click_canc() {
	$('form').reset();
	delete obj;
	cont = 0;
	Tprecio = 0;
	Treset();
	$('input#codigo').removeAttr('readOnly');
	$('input#cedula').removeAttr('readOnly');
	$('body > main > div.ctotal').text('Total: 0 Bs');
}
/*
*	Reset Tabla
*/
function Treset() {
	$('body > main > div > table > tbody').html(null);
}
/*
*	Busca Clientes
*/
function bus_cliente(cedula) {
	if(cedula.length > 6 && cedula.length < 9) {
		$.post('/client/find', {
			cedula: cedula
		}).done(function(result){
			if(result != 'error') {
				if(result) {
					$('input#cedula').attr('readOnly','true');
					$('input#nombre').val(result[0]["nombre"]);
					$('input#telefono').val(result[0]["telefono"]);
				}
			}
			else 
				alert("Error Fatal.!");
		});
	}
}
/*
*	Busca Articulo = nombre
*/
function bus_articulo_name(nombre) {
	nombre = (nombre.length > 0) ? nombre : ' ';
	$.post('/articles/findName', {
		nombre: nombre
	}).done(function(result){
		if(result != 'error') {
			if(result) {
				Treset();
				$('#fixedHeader > tr').html("<th>CODIGO</th><th>DESCRIPCION</th><th>CANTIDAD</th><th>PRECIO</th><th>OPERACION</th>");
				for(i=0; result.length>i; i++) {
					$('<tr>'+
						'<td>'+result[i]["codigo"]+'</td>'+
						'<td>'+result[i]["descripcion"]+'</td>'+
						'<td>'+result[i]["cantidad"]+'</td>'+
						'<td>'+result[i]["precio"]+'</td>'+
						'<td>'+
							'<input id="sel'+i+'" class="selector" type="number" max="'+result[i]["cantidad"]+'" min="0" value="0" onkeyup="verific_selected($(this));">'+
							'<input class="btn btn-info ok" type="button" value="Ok" onclick="item_select(\''+result[i]["codigo"]+'\',\''+result[i]["descripcion"]+'\',$(\'#sel'+i+'\').val(),'+result[i]["precio"]+');">'+
						'</td>'+
						'</tr>').appendTo('body > main > div > table > tbody');
				}
			}
		}
		else 
			alert("Error Fatal.!");
	});
}
/*
*	Articulo Verifica Pre-Selecionado
*/
function verific_selected(xthis) {
	if( parseInt(xthis.val()) > parseInt(xthis.attr('max'))) {
		alert('El numero ingresado exede el inventario o es invalido.');
		xthis.val(0);
	}
}
/*
*	Articulo Selecionado
*/
function item_select(icodigo,inombre,icantidad,iprecio) {
	precio = parseInt(icantidad) * parseFloat(iprecio)
	obj[cont++] = {codigo: icodigo, nombre: inombre, precio: iprecio, cantidad: icantidad};
	Tprecio = Tprecio + precio;
	$('body > main > div.ctotal').text('Total: '+Tprecio+' Bs');
	seleccionado();
}
/*
*	Restablece Selecionado
*/
function seleccionado() {
	Treset();
	for (var i=0; i<cont; i++) {
		$('<tr>'+
			'<td>'+obj[i].codigo+'</td>'+
			'<td>'+obj[i].nombre+'</td>'+
			'<td>'+obj[i].cantidad+'</td>'+
			'<td>'+obj[i].precio+'</td>'+
			'<td>'+
				'<input class="btn btn-danger ok" type="button" value="Remover" onclick="item_unselect('+i+');">'+
			'</td>'+
		'</tr>').appendTo('body > main > div > table > tbody');
	}
	console.log(obj)
}
/*
*	Articulo UnSelecionado
*/
function item_unselect(x) {
	Tprecio = Tprecio - obj[x].precio;
	$('body > main > div.ctotal').text('Total: '+Tprecio+' Bs');
	obj.splice(x,1);
	cont--;
	seleccionado();
}
/*
*	Busca Aticulo Codigo
*/
function bus_articulo_cod(codigo) {
	$.post('/article/findCod', {
		codigo: codigo
	}).done(function(result){
		if(result != 'error') {
			if(result) {
				$('input#codigo').attr('readOnly','true');
				$('input#codigo').val(result[0]["codigo"]);
				$('input#desc').val(result[0]["descripcion"]);
				$('input#precio').val(result[0]["precio"]);
				$('input#cant').val(result[0]["cantidad"]);
			}
		}
		else 
			alert("Error Fatal.!");
	});
}
/*
*	Guarda Aticulo
*/
function save_articulo() {
	var codigo = $('input#codigo').val();
	var nombre = $('input#desc').val();
	var precio = $('input#precio').val();
	var cantidad = $('input#cant').val();
	if(codigo.length > 0 && nombre.length > 0 && precio.length > 0 && cantidad.length > 0) {
		$.post('/article/save', {
			codigo: codigo,
			descripcion: nombre,
			precio: precio,
			cantidad: cantidad
		}).done(function(result){
			if(result != 'error') {
				alert('guardo');
				click_canc();
				list_articulo();
			} else
				alert("Error Fatal.!");
		});
	} else
		alert("Se deben llenar todos los campos.");
}
/*
*	Carga Lista Aticulo
*/
function list_articulo() {
	$.post('/articles/list', {
	}).done(function(result){
		if(result != 'error') {
			if(result) {
				Treset();
				$('<tbody class="scrollContent"></tbody>').appendTo('body > main > div > table');
				for(i=0; result.length>i; i++) {
					$('<tr>'+
						'<td>'+result[i]["codigo"]+'</td>'+
						'<td>'+result[i]["descripcion"]+'</td>'+
						'<td>'+result[i]["cantidad"]+'</td>'+
						'<td>'+result[i]["precio"]+'</td>'+
						'</tr>').appendTo('body > main > div > table > tbody');
				}
			}
		}
		else 
			alert("Error Fatal.!");
	});
}
/*
*	Guarda Venta
*/
function save_venta() {
	var cedula = $('input#cedula').val();
	var nombre = $('input#nombre').val();
	var telefono = $('input#telefono').val();
	if(cedula.length > 0 && nombre.length > 0 && telefono.length > 0 && Tprecio > 0 && obj.length > 0) {
		$.post('/operacion/save', {
			cedula: cedula,
			nombre: nombre,
			telefono: telefono,
			fecha_pedido: null,
			fecha_out: null,
			fecha_venta: true,
			obj: obj,
			estado: 'venta'
		}).done(function(result){
			if(result != 'error') {
				alert('guardo');
				click_canc();
			} else
				alert("Error Fatal.!");
		});
	} else
		alert("Se deben llenar todos los campos.");
}
/*
*	Guarda Pedido
*/
function save_pedido() {
	var cedula = $('input#cedula').val();
	var nombre = $('input#nombre').val();
	var telefono = $('input#telefono').val();
	var pfecha = $('input#pfecha').val();
	if(cedula.length > 0 && nombre.length > 0 && telefono.length > 0 && pfecha.length > 0 && Tprecio > 0 && obj.length > 0) {
		$.post('/operacion/save', {
			cedula: cedula,
			nombre: nombre,
			telefono: telefono,
			fecha_pedido: true,
			fecha_out: pfecha,
			fecha_venta: null,
			obj: obj,
			estado: 'pedido'
		}).done(function(result){
			if(result != 'error') {
				alert('guardo');
				click_canc();
			} else
				alert("Error Fatal.!");
		});
	} else
		alert("Se deben llenar todos los campos.");
}
/*
*	Carga Lista Venta del Dia
*/
function list_venta_dia(dia) {
	$.post('/ventas/listdia', {
		dia: dia
	}).done(function(result){
		if(result != 'error') {
			if(result) {
				Treset();
				// $('<tbody class="scrollContent"></tbody>').appendTo('body > main > div > table');
				var total = 0;
				for(i=0; result.length>i; i++) {
					estado = '<td><input type="button" id="nil" value="Anular" class="btn btn-danger" onclick="anula('+result[i]["id"]+');"></td>';
					if(result[i]["estado"] == 'nulo-venta' || result[i]["estado"] == 'nulo-pedido-venta') {
						estado = '<td><strong style="color:red;">Anulado</strong></td>';
					}
					total += parseFloat(result[i]["total"]);
					$('<tr>'+
						'<td>'+result[i]["cliente"]+'</td>'+
						'<td>'+result[i]["recibo"]+'</td>'+
						estado+
						'</tr>').appendTo('body > main > div > table > tbody');
				}
				$('body > main > div.ctotal').text('Total: '+total+' Bs');
			}
		}
		else 
			alert("Error Fatal.!");
	});
}
/*
*	Anula Operacion
*/
function anula(id) {
	if(confirm('Esta seguro de eliminar la Venta?')) {
		$.post('/operacion/nulo', {
			id: id
		}).done(function(result){
			if(result != 'error') {
				if(result) {
					alert('Operacion Anulada');
				}
			}
			else 
				alert("Error Fatal.!");
		});
	}
}
/*
*	Lista de Pedidos Pendientes
*/
function list_pedido_pen() {
	$.post('/pedido/listpen', {
	}).done(function(result){
		if(result != 'error') {
			if(result) {
				Treset();
				$('<tbody class="scrollContent"></tbody>').appendTo('body > main > div > table');
				var total = 0;
				for(i=0; result.length>i; i++) {
					total += parseFloat(result[i]["total"]);
					$('<tr>'+
						'<td>'+result[i]["cliente"]+'</td>'+
						'<td>'+result[i]["recibo"]+'</td>'+
						'<td>'+
						'<input type="button" id="nil" value="Anular" class="btn btn-danger" onclick="anula('+result[i]["id"]+');">&nbsp;&nbsp;'+
						'<input type="button" id="fact" value="Faturar" class="btn btn-success" onclick="fact_send('+result[i]["id"]+');"><br><br>'+
						'<input id="abo'+i+'" class="selector" type="number" max="'+result[i]["total"]+'" min="0" value="0">'+
						'<input class="btn btn-info ok" type="button" value="Abonar" onclick="abono('+result[i]["id"]+',$(\'#abo'+i+'\','+result[i]["total"]+').val());">'+
						'</td>'+
						'</tr>').appendTo('body > main > div > table > tbody');

				}
				$('body > main > div.ctotal').text('Total: '+total+' Bs');
			}
		}
		else 
			alert("Error Fatal.!");
	});
}
/*
*	Factura Pedido
*/
function fact_send(id) {
	if(confirm('Esta seguro de Facturar el Pedido?')) {
		$.post('/pedido/fact', {
			id: id
		}).done(function(result){
			if(result != 'error') {
				if(result) {
					alert('Pedido Facturado');
				}
			}
			else 
				alert("Error Fatal.!");
		});
	}
}
/*
*	Pedidos del Mes
*/
function pedido_mes() {
	var bfecha = $('input#bfecha').val();
	$.post('/pedido/mes', {
		mes: bfecha
	}).done(function(result){
		if(result != 'error') {
			if(result) {
				Treset();
				// $('<tbody class="scrollContent"></tbody>').appendTo('body > main > div > table');
				var total = 0;
				for(i=0; result.length>i; i++) {
					if(result[i]["estado"] == 'nulo-pedido' || result[i]["estado"] == 'nulo-pedido-venta') {
						estado = '<td><strong style="color:red;">Anulado</strong></td>';
					} else if(result[i]["estado"] == 'pedido') {
						estado = '<td><strong style="color:blue;">Pendiente</strong></td>';
					} else {
						estado = '<td><strong style="color:green;">Vendido</strong></td>';
					}
					total += parseFloat(result[i]["total"]);
					$('<tr>'+
						'<td>'+result[i]["cliente"]+'</td>'+
						'<td>'+result[i]["recibo"]+'</td>'+
						estado+
						'</tr>').appendTo('body > main > div > table > tbody');
				}
				$('body > main > div.ctotal').text('Total: '+total+' Bs');
			}
		}
		else 
			alert("Error Fatal.!");
	});
}
/*
*	Pedido Abona
*/
function abono(id, valor, total) {
	if(valor > 0 && valor < total) {
		if(confirm('Esta seguro de Abonar al Pedido?')) {
			$.post('/pedido/abono', {
				id: id,
				valor: valor
			}).done(function(result){
				if(result != 'error') {
					if(result) {
						alert('Abono Asignado');
					}
				}
				else 
					alert("Error Fatal.!");
			});
		}
	} else
		alert('El numero ingresado no es valido.');
}
/*
*	Guarda Nuevo Usuario
*/
function save_user() {
	var cedula = $('input#cedula').val();
	var nombre = $('input#nombre').val();
	var grado = $('input#grado').val();
	var clave = $('input#clave').val();
	var reclave = $('input#reclave').val();
	if(clave == reclave) {
		$.post('/user/save', {
			cedula: cedula,
			nombre: nombre,
			grado: grado,
			clave: clave
		}).done(function(result){
			if(result != 'error') {
				if(result) {
					alert('Usrario Guardado');
				}
			}
			else 
				alert("Error Fatal.!");
		});
	}
}

$(document).ready(function() {
	/*
	*	Detecta entrada de Texto
	*/
	$(document).keyup(function(e){
		var f = $('input#form-data').val()
		if(e.which == 27 && (f == '1' || f == '3')) {
			seleccionado();
		}
	});
	/*
	*	Autocomplete = OFF
	*/
	$('textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input').attr('autocomplete','off');
	/*
	*	Botones del menu
	*/
	var btn_all = $('body > header > nav > div > ul > li');
	var btn1 = $('body > header > nav > div > ul > li:nth-child(2)');
	var btn2 = $('body > header > nav > div > ul > li:nth-child(3)');
	var btn3 = $('body > header > nav > div > ul > li:nth-child(4)');
	var btn4 = $('body > header > nav > div > ul > li:nth-child(5)');
	var btn5 = $('body > header > nav > div > ul > li:nth-child(6)');
	var btn6 = $('body > header > nav > div > ul > li:nth-child(7)');
	var btn7 = $('body > header > nav > div > ul > li:nth-child(8)');
	/*
	*	Click de todos los botones
	*/
	btn_all.click(function(){
		if(!$(this).is('.logo') && !$(this).is('#user_name')) {
			btn_all.removeClass('active');
			$(this).addClass('active');
			click_canc();
		}
	});
	/*
	*	Click Boton 1
	*/
	btn1.click(function(){
		$('input#form-data').val(1);
		$('body > main > form').load('layout/btn1.html');
		$('#fixedHeader > tr').html("<th>CODIGO</th><th>DESCRIPCION</th><th>CANTIDAD</th><th>PRECIO</th><th>OPERACION</th>");
	});
	/*
	*	Click Boton 2
	*/
	btn2.click(function(){
		$('input#form-data').val(2);
		$('body > main > form').load('layout/btn2.html');
		$('#fixedHeader > tr').html("<th>CLIENTE</th><th>ARTICULOS</th><th>OPERACION</th>");
	});
	/*
	*	Click Boton 3
	*/
	btn3.click(function(){
		$('input#form-data').val(3);
		$('body > main > form').load('layout/btn3.html');
		$('#fixedHeader > tr').html("<th>CODIGO</th><th>DESCRIPCION</th><th>CANTIDAD</th><th>PRECIO</th><th>OPERACION</th>");
	});
	/*
	*	Click Boton 4
	*/
	btn4.click(function(){
		$('input#form-data').val(4);
		$('body > main > form').load('layout/btn4.html');
		$('#fixedHeader > tr').html("<th>CLIENTE</th><th>ARTICULOS</th><th>OPERACION</th>");
		list_pedido_pen();
	});
	/*
	*	Click Boton 5
	*/
	btn5.click(function(){
		$('input#form-data').val(5);
		$('body > main > form').load('layout/btn5.html');
		$('#fixedHeader > tr').html("<th>CLIENTE</th><th>ARTICULOS</th><th>ESTADO</th>");
	});
	/*
	*	Click Boton 6
	*/
	btn6.click(function(){
		$('input#form-data').val(6);
		$('body > main > form').load('layout/btn6.html');
		$('#fixedHeader > tr').html("<th>CODIGO</th><th>NOMBRE</th><th>CANTIDAD</th><th>PRECIO</th>");
		list_articulo();
	});
	/*
	*	Click Boton 7
	*/
	btn7.click(function(){
		$('input#form-data').val(7);
		$('body > main > form').load('layout/btn7.html');
		$('#fixedHeader > tr').html(null);
	});
});