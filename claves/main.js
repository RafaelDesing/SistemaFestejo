jQuery.fn.reset = function () {
    $(this).each (function() { this.reset(); });

}
/*
*   VARIABLES
*/
var rango = 0;
var bufftabla = null; //estado anterior de la tabla
/*
*   FUNCIONES CONTROLAN BOTONES DE TABLA
*/
function selsel( xthis ) {
    var cant_in = parseInt(xthis.parent().find(' > input[type*=number]').val());
    var tr = xthis.parent().parent();
    var cant_real = parseInt(tr.find(' > td:eq(2)').text());

    if(cant_in > 0 && cant_real > 0 && cant_in <= cant_real) {
        $('input#canselec1').click();
        $('<tr class="normalRow"><td><strong>'+ tr.find(' > td:eq(0)').text() +'</strong></td>'+
            '<td>'+ tr.find(' > td:eq(1)').text() +'</td><td>'+ cant_in +'</td>'+
            '<td>'+ tr.find(' > td:eq(3)').text() +'</td><td>'+
                '<input type="button" class="btn btn-danger btn-xs" onclick="unselsel( $(this) );" value="Remover">'+
            '</td></tr>').appendTo('#tableContainer > table > tbody');
        $('div#zona_busq_art > div > input').focus();
        acttotal();
    }
}
function unselsel( xthis ) {
    var tr = xthis.parent().parent();
    tr.remove();
    acttotal();
}
function acttotal() {
    var trs = $('#tableContainer > table > tbody');
    var acum = 0, monto = 0, cant = 0;
    for(var i=0; i<trs.find(' > tr').length; i++) {
        monto = parseFloat(trs.find(' > tr:eq('+i+')').find(' > td:eq(3)').text());
        cant = parseFloat(trs.find(' > tr:eq('+i+')').find(' > td:eq(2)').text());
        acum += (monto * cant);
    }
    $('#uno > form > div:nth-child(6) > strong > em > span').text( (acum > 0) ? acum.toFixed(2) : '0.00' );
    actsave();
}
/*
*   ACTIVA ENVIO
*/
function actsave() {
    var op = $('#uno > form > div:nth-child(4) > div > input[class*="btn-success"]').attr('id');
    var art = $('#tableContainer > table > tbody > tr').length;
    var ced = $('input#cedula').val().length;
    var nom = $('input#nombre').val().length;
    if(art > 0 && ced > 0 && nom > 0 && (op == 'facturar' || op == 'pedido'))
        $('button#save1').removeAttr('disabled');
    else
        $('button#save1').attr('disabled','disabled');
}
/*
*   ENVIA EL CODIGO PARA LA EDICION
*/
function codforedit(tr) {
    var code = tr.find(' > td:eq(0)').text();
    $('input#codigo').val(code);
    $('input#codigo').keyup();
}
/*
*   ACTIVA ENVIO FORM2
*/
function actsave2() {
    var c = $('input#codigo').val().length;
    var d = $('input#descripcion').val().length;
    var n = $('input#cantidad').val().length;
    var p = $('input#precio').val().length;
    if(c > 0 && d > 0 && n > 0 && p > 0)
        $('input#save2').removeAttr('disabled');
    else
        $('input#save2').attr('disabled','disabled');
}
/*
*   CARGA LISTA DE MOVIMIENTOS DE USUARIO
*/
// function movuser() {
//     for(var i=0; i<15; i++)
//         $('<tr class="normalRow"><td>30/09/2016</td><td><strong>DESCRIPCION</strong></td><td>venta</td></tr>').appendTo('#tableContainer3 > table > tbody');
// }
/*
*   ACTIVA ENVIO FORM3
*/
function actsave3() {
    var c = $('input#ucedula').val().length;
    var d = $('input#unombre').val().length;
    var n = $('input#uclave').val().length;
    if(c > 0 && d > 0 && n > 0)
        $('input#save3').removeAttr('disabled');
    else
        $('input#save3').attr('disabled','disabled');
}
/*
*   SEND FORM1
*/
function sendform1() {
    var cedula = $('input#cedula').val();
    var nombre = $('input#nombre').val();
    var telefono = ($('input#telefono').val().length > 0) ? $('input#telefono').val() : '-';
    var tbody = $('#tableContainer > table > tbody');
    var op = $('#uno > form > div:nth-child(4) > div > input[class*="btn-success"]').attr('id');
    var total = 0;
    var array = [ ];
    for (var i = 0; i < tbody.find(' > tr').length; i++) {
        array[i] = {
            articulo: tbody.find(' > tr:eq('+i+')').find(' > td:eq(0)').text(),
            descripcion: tbody.find(' > tr:eq('+i+')').find(' > td:eq(1)').text(),
            cantidad: tbody.find(' > tr:eq('+i+')').find(' > td:eq(2)').text(),
            precio: tbody.find(' > tr:eq('+i+')').find(' > td:eq(3)').text()
        };
        var monto = parseFloat(tbody.find(' > tr:eq('+i+')').find(' > td:eq(3)').text());
        var cant = tbody.find(' > tr:eq('+i+')').find(' > td:eq(2)').text();
        total += (monto * cant);
    }
    var fechaex = $('#fechae').val();
    $.post('/sendF1',{
        cedula: cedula,
        nombre: nombre,
        telefono: telefono,
        opr: op,
        total: total,
        fechae: fechaex,
        array: array
    }).done(function(result){
        if(result == 'ok') {
            $('input#cancel1').click();
            if(op == 'facturar') {
                FAlert('Venta exitosa.!',true);
            } else {
                FAlert('Pedido guardado.!',true);
            }
        }
    });
}
/*
*   SEND FORM2
*/
function sendform2() {
    var codigo = $('input#codigo').val();
    var descripcion = $('input#descripcion').val();
    var cantidad = $('input#cantidad').val();
    var precio = $('input#precio').val();
    $.post('/sendF2',{
        codigo: codigo,
        descripcion: descripcion,
        cantidad: cantidad,
        precio: precio
    }).done(function(result){
        if(result == 'ok') {
            FAlert('Operacion exitosa.!',true);
            $('input#cancel1').click();
            $('input#lista').click();
        }
    });
}
/*
*   SEND FORM3
*/
function sendform3() {
    var ucedula = $('input#ucedula').val();
    var unombre = $('input#unombre').val();
    var uclave = $('input#uclave').val();
    var urango = $('select#urango').val();
    $.post('/sendF3',{
        ucedula: ucedula,
        unombre: unombre,
        uclave: uclave,
        urango: urango
    }).done(function(result){
        // alert(result);
        $('input#cancel1').click();
    });
}
/*
*   ANULA VENTA DEL DIA
*/
function anulVenta(idx) {
    $.post('/anulVen', {
        idx: idx
    }).done(function(result) {
        // alert(result);
        $('input#cancel1').click();
    });
}
/*
*   ANULA PEDIDO
*/
function anulPedido(idx) {
    $.post('/anulPedido', {
        idx: idx
    }).done(function(result) {
        // alert(result);
        $('input#cancel1').click();
    });
}
/*
*   FACTURA LA VENTA DE UN PEDIDO
*/
function factPedido(idx) {
    $.post('/factPedido', {
        idx: idx
    }).done(function(result) {
        // alert(result);
        $('input#cancel1').click();
    });
}
/*
*   ABONA PEDIDO
*/
function abonaPedido(idx) {
    abonox = $('input#text_abono').val();
    $.post('/abonoPedido',{
        id: idx,
        abono: abonox
    }).done(function(result){
        // alert(result);
        $('input#lpp').click();
    });
}
/*
*   FUNCIONES DE ALERTA
*/
function ZonaAlertMay() {
    $('div.zona_alert_may').fadeTo(800, 1, function(){});
    $('div.zona_alert_may').fadeTo(15000, 0, function(){
        $(this).css('display','none');
    });
}
//FAlert('textoA',true);
//FAlert('textoB',false);
function FAlert(texto,tonica) {
    $('div#falert').css('display','none');
    $('div#falert').removeClass('alert-success');
    $('div#falert').removeClass('alert-error');
    if(tonica)
        $('div#falert').addClass('alert-success');
    else
        $('div#falert').addClass('alert-error');
    $('div#falert').html(texto);
    $('div#falert').css('display','block');
    // alert($('div#falert').css('display'))
    $('div#falert').fadeTo(5000, 0, function(){
        $(this).css('display','none');
        $('div.zona_alert').css('display','none');
    });
}
/*
*   ONLOAD DEL DOM
*/
$(document).ready(function(e){

    $('input[type="submit"],input[type="button"]').addClass('btn btn-primary btn-xs');

    var w = $(document).width();
    var m = $('main').width();
    var t = (w - m) / 2;
    $('header,main').css('margin-left',t+'px');
    /*
    *   CONTROL DE LOS TABS MENU
    */
    $('.tablinks').on('click',function(e){
        $('.tabcontent').css('display','none');
        $('.tablinks').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('subid');
        $('#'+id).css('display','block');
    });
    /*
    *   FUNCION ENTRADA AL SISTEMA
    */
    $('input#sing').click(function(e) {
        var c = $('input#Ucedula').val();
        var p = $('input#Uclave').val();
        if(c.length > 0 && p.length > 0) {
            $.post('/sing', {
        		ucedula: c,
                uclave: p
        	}).done(function(result) {
                if(result != 'error') {
                    rango = result.rango;
                    $('#name > em > spam').text(result.nombre);
                    $('ul.tab,div.tabcontent:eq(0),span#name').css('display','block');
                    $('div#entrada').css('display','none');
                    $('input#cedula').focus();
                } else { ZonaAlertMay(); }
        	});
        }
    });
    /*
    *   MASTER BOTONES
    */
    $('#uno > form > div:nth-child(4) > div > input').click(function(e){
        var id = $(this).attr('id');
        $('#tableContainer > table > tbody').html(null);
        /*
        *   control fechas
        */
        $('div#fecha_busca,div#fecha_pedido').css('display','none');
        if(id != 'canselec1' && id != 'cancel1')
            if(id == 'pedido')
                $('div#fecha_pedido').css('display','block');
            else if(id != 'facturar' && id != 'lpp')
                $('div#fecha_busca').css('display','block');
        /*
        *   control tabla
        */
        $('#fixedHeader > tr').html(null);
        if(id == 'pedido' || id == 'facturar')
            $('<th>CODIGO</th><th>DESCRIPCION</th><th>CANTIDAD</th><th>PRECIO</th><th>OPERACION</th>').appendTo('#fixedHeader > tr');
        else if(id == 'lvd')
            $('<th>CLIENTE</th><th>ARTICULOS</th><th>OPERACION</th>').appendTo('#fixedHeader > tr');
        else if(id == 'lpp')
            $('<th>CLIENTE</th><th>ARTICULOS</th><th>OPERACION</th>').appendTo('#fixedHeader > tr');
        else if(id == 'lpm')
            $('<th>CLIENTE</th><th>ARTICULOS</th><th>ESTADO</th>').appendTo('#fixedHeader > tr');
        /*
        *   controla la zona de busqueda (input-text) de articulos
        */
        if(id == 'pedido' || id == 'facturar') {
            $('div#zona_busq_art').css('display','block');

        } else {
            $('div#zona_busq_art').css('display','none');
        }
        /*
        *   control de color boton seleccionado
        */
        if(id != 'canselec1' && id != 'cancel1' && id != 'busca') {
            $('#facturar, #lvd, #pedido, #lpp, #lpm').removeClass('btn-success');
            $(this).addClass('btn-success');
        }
    });
    /*
    *   BOTONES CANCELAR
    */
    $('input#cancel1').click(function(e){
        $('form').reset();
        $('input#cedula').removeAttr('disabled');
        $('input#cedula').focus();
        $('#tableContainer > table > tbody').html( (bufftabla = null) );
        $('#uno > form > div:nth-child(6) > strong > em > span').text('0.00');
        $('#uno > form > div:nth-child(4) > div > input[class*="btn-success"]').removeClass('btn-success');
        $('input#canselec1').attr('disabled','disabled');
        actsave();
    });
    $('input#canselec1').click(function(e){
        var id = $('#uno > form > div:nth-child(4) > div > input[class*="btn-success"]').attr('id');
        if(id == 'pedido' || id == 'facturar')
            $('input#'+id).click();
        $(this).attr('disabled','disabled');
        $('#tableContainer > table > tbody').html(bufftabla);
        bufftabla = null;
    });
    /*
    *   BUSCA CLIENTE
    */
    $('input#cedula').keyup(function(e){
        $.post('/findCli', {
            cedula: $('input#cedula').val()
        }).done(function(result) {
            if(result != 'error') {
                $('input#nombre').val(result.nombre);
                $('input#telefono').val(result.telefono);
                $('input#cedula').attr('disabled','disabled');
            }
        });
    });
    /*
    *   BUSCA ARTICULO
    */
    $('input#busca_art').keyup(function(e){
        bufftabla = (bufftabla == null) ? $('#tableContainer > table > tbody').html() : bufftabla;
        $('input#canselec1').removeAttr('disabled');
        $('#fixedHeader > tr,#tableContainer > table > tbody').html(null);
        $('<th>CODIGO</th><th>DESCRIPCION</th><th>CANTIDAD</th><th>PRECIO</th><th>OPERACION</th>').appendTo('#fixedHeader > tr');
        $.post('/findArtDesc', {
            descripcion: $('input#busca_art').val()
        }).done(function(result) {
            for(var i=0; i<result.length; i++)
                $('<tr class="normalRow"><td><strong>'+result[i].codigo+'</strong></td><td>'+result[i].descripcion+'</td><td>'+result[i].cantidad+'</td><td>'+result[i].precio+'</td><td>'+
                        '<input type="number" class="text-xs" style="font-size:10px;padding:1px;" placeholder="Cantidad">&nbsp;&nbsp;'+
                        '<input type="button" class="selsel btn btn-primary btn-xs" onclick="selsel( $(this) );" value="Seleccionar">'+
                    '</td></tr>').appendTo('#tableContainer > table > tbody');
        });
    });
    /*
    *   REGISTRA CAMBIOS EN CEDULA - NOMBRE
    */
    $('input#cedula,input#nombre').keyup(function(e){ actsave(); });

    /*
    *   LISTA DE PEDIDOS PENDIENTES
    */
    $('input#lpp').click(function(e){
        $('#tableContainer > table > tbody').html(null);
        var total = 0.00;
        $.post('/findLpp', {}).done(function(result) {
            for(var i=0; i<result.length; i++) {
                var articulo = '';
                var disabled = (rango != 1) ? 'disabled="disabled"' : ' ';
                for(var y=0; (result[i].articulo[y] != undefined); y++) {
                    articulo += '<strong>'+result[i].articulo[y].descripcion+'</strong><br>Codigo: '+result[i].articulo[y].codigo+'<br>Cantidad: '+result[i].articulo[y].cantidad+'<br>Total: '+result[i].articulo[y].precio+' Bs.<br>**********************************<br>';
                }
                articulo += 'Abono:&nbsp;&nbsp;<strong style="color:green;">'+ result[i].abono +' Bs.</strong><br>'+
                            'Sub-Total:&nbsp;&nbsp;<strong style="color:black;">'+ result[i].total +' Bs.</strong><br>'+
                            'Total:&nbsp;&nbsp;<strong style="color:red;">'+ (result[i].total - result[i].abono) +' Bs.</strong><br>**********************************<br>';
                $('<tr class="normalRow"><td><input type="button" class="btn btn-primary btn-xs" onclick="$(\'#cedula\').val('+ result[i].cedula +');$(\'#cedula\').keyup();" value="'+ result[i].cedula +'"><br>**************************************<br>* Fecha de Entrega: <strong style="color:red;">'+ result[i].fechae +'</strong> *<br>**************************************</td>'+
                '<td>'+articulo+'</td>'+
                '<td>'+
                    '<input type="button" id="btn-anula-pdido" class="btn btn-danger btn-xs" onclick="anulPedido(\''+ result[i]._id +'\');" value="anular" '+disabled+'>'+
                    '&nbsp;&nbsp;&nbsp;<input type="button" id="btn-factura-pedido" class="btn btn-primary btn-xs" onclick="factPedido(\''+ result[i]._id +'\');" value="Facturar" '+disabled+'>'+
                    '<br><br><input id="text_abono" type="number" class="text-xs" style="font-size:10px;padding:1px;width:100px;" placeholder="Cantidad">&nbsp;&nbsp;&nbsp;'+
                    '<input type="button" id="btn-anula-pdido" class="btn btn-success btn-xs" onclick="abonaPedido(\''+ result[i]._id +'\');" value="Abonar">'+
                '</td>'+
                '</tr>').appendTo('#tableContainer > table > tbody');
                if(result[i].estado == 1 || result[i].estado == 3)
                    total += result[i].total;
            }
            $('#uno > form > div:nth-child(6) > strong > em > span').text(total.toFixed(2));
        });
    });
    /*
    *   BOTON GUARDAR
    */
    $('button#save1').click(function(e){ sendform1(); });
    /*
    *   LISTA DE PEDIDOS DEL MES Y VENTA DEL DIA
    */
    $('input#busca').click(function(e){
        var total = 0.00;
        $('#tableContainer > table > tbody').html(null);
        var idact = $('#uno > form > div:nth-child(4) > div > input[class*="btn-success"]').attr('id');
        if(idact == 'lvd') {
            $.post('/findLvd', {
                fecha: $('input#fechab').val()
            }).done(function(result) {
                for(var i=0; i<result.length; i++) {
                    var articulo = '';
                    var oper = '<strong style="color:red;">VENTA ANULADA</strong>';
                    var disabled = (rango != 1) ? 'disabled="disabled"' : ' ';
                    var pedido = '';
                    if(result[i].pedido != 'n')
                        pedido = '<span style="color:red;">Pedido</span>';
                    if(!result[i].anula) {
                        oper = '<input type="button" class="btn btn-danger btn-xs" onclick="anulVenta(\''+ result[i]._id +'\');" value="anular" '+disabled+'>';
                        total += result[i].total;
                    }
                    for(var y=0; (result[i].articulo[y] != undefined); y++) {
                        articulo += '<strong>'+result[i].articulo[y].descripcion+'</strong><br>Codigo: '+result[i].articulo[y].codigo+'<br>Cantidad: '+result[i].articulo[y].cantidad+'<br>Total: '+result[i].articulo[y].precio+' Bs.<br>**********************************<br>';
                    }
                    articulo += '<strong style="color:red;">'+ result[i].total +' Bs.</strong><br>**********************************<br>'+pedido;
                    $('<tr class="normalRow"><td><input type="button" class="btn btn-primary btn-xs" onclick="$(\'#cedula\').val('+ result[i].cedula +');$(\'#cedula\').keyup();" value="'+ result[i].cedula +'"></td>'+
                    '<td>'+articulo+'</td>'+
                    '<td>'+ oper +'</td>'+
                    '</tr>').appendTo('#tableContainer > table > tbody');
                }
                $('#uno > form > div:nth-child(6) > strong > em > span').text(total.toFixed(2));
            });
        } else if(idact == 'lpm'){
            $.post('/findLpm', {
                fecha: $('input#fechab').val()
            }).done(function(result) {
                for(var i=0; i<result.length; i++) {
                    var articulo = '';
                    var estado = '';
                    switch (result[i].estado) {
                        case 0:
                            estado = '<strong style="color:red;">CANCELADO</strong>';
                            break;
                        case 1:
                            estado = '<strong style="color:blue;">VENDIDO</strong>';
                            break;
                        case 2:
                            estado = '<strong style="color:red;">VENCIDO</strong>';
                            break;
                        case 3:
                            estado = '<strong style="color:blue;">ACTIVO</strong>';
                            break;
                    }
                    for(var y=0; (result[i].articulo[y] != undefined); y++) {
                        articulo += '<strong>'+result[i].articulo[y].descripcion+'</strong><br>Codigo: '+result[i].articulo[y].codigo+'<br>Cantidad: '+result[i].articulo[y].cantidad+'<br>Total: '+result[i].articulo[y].precio+' Bs.<br>**********************************<br>';
                    }
                    articulo += '<strong style="color:red;">'+ result[i].total +' Bs.</strong><br>**********************************<br>';
                    $('<tr class="normalRow"><td><input type="button" class="btn btn-primary btn-xs" onclick="$(\'#cedula\').val('+ result[i].cedula +');$(\'#cedula\').keyup();" value="'+ result[i].cedula +'"><br>**************************************<br>* Fecha de Entrega: <strong style="color:red;">'+ result[i].fechae +'</strong> *<br>**************************************</td>'+
                    '<td>'+articulo+'</td>'+
                    '<td>'+ estado +'</td>'+
                    '</tr>').appendTo('#tableContainer > table > tbody');
                    if(result[i].estado == 1 || result[i].estado == 3)
                        total += result[i].total;
                }
                $('#uno > form > div:nth-child(6) > strong > em > span').text(total.toFixed(2));
            });
        }
    });

    /*
    *   ********* FORMULARIO ALMACEN **********
    */

    /*
    *   BUSCA ARTICULO
    */
    $('input#codigo').keyup(function(e){
        $.post('/findArtCod', {
            codigo: $('input#codigo').val()
        }).done(function(result) {
            if(result != 'error') {
                $('input#descripcion').val(result.descripcion);
                $('input#cantidad').val(result.cantidad);
                $('input#precio').val(result.precio);
                $('input#codigo').attr('disabled','disabled');
            }
        });
    });
    /*
    *   BOTON CANCELAR
    */
    $('input#cancel2').click(function(e){
        $('form#form2').reset();
        $('input#save2').attr('disabled','disabled');
        $('input#codigo').removeAttr('disabled');
        $('input#codigo').focus();
    });
    /*
    *   CARGA LISTA DE ARTICULOS
    */
    $('input#lista').click(function(e){
        FAlert('Operacion exitosa.!',true);
        $('#fixedHeader > tr').html('<th>CODIGO</th><th>DESCRIPCION</th><th>CANTIDAD</th><th>PRECIO</th><th>OPERACION</th>');
        $('#tableContainer2 > table > tbody').html(null);
        $.post('/findArtAll', {}).done(function(result) {
            for(var i=0; i<result.length; i++)
                $('<tr class="normalRow"><td><strong>'+result[i].codigo+'</strong></td><td>'+result[i].descripcion+'</td><td>'+result[i].cantidad+'</td><td>'+result[i].precio+'</td><td>'+
                        '<input type="button" class="edisel btn btn-primary btn-xs" onclick="codforedit( $(this).parent().parent() );" value="Editar">'+
                    '</td></tr>').appendTo('#tableContainer2 > table > tbody');
        });
    });
    /*
    *   REGISTRA CAMBIOS EN CODIGO - DESCRIPCION - CANTIDAD - PRECIO
    */
    $('input#codigo,input#descripcion,input#cantidad,input#precio').keyup(function(e){ actsave2(); });
    /*
    *   BOTON GUARDAR
    */
    $('input#save2').click(function(e){ sendform2(); });

    /*
    *   ********* FORMULARIO USUARIO **********
    */

    /*
    *   BUSCA USUARIO
    */
    $('input#ucedula').keyup(function(e){
        $.post('/findUser', {
            cedula: $('input#ucedula').val()
        }).done(function(result) {
            if(result != 'error') {
                $('input#unombre').val(result.nombre);
                $('input#uclave').val(result.clave);
                $('select#urango > option').removeAttr('selected');
                $('select#urango > option[value*="'+result.rango+'"]').attr('selected','selected');
                $('input#ucedula').attr('disabled','disabled');
                movuser();
                actsave3();
            }
        });
    });
    /*
    *   BOTON CANCELAR
    */
    $('input#cancel3').click(function(e){
        $('form#form3').reset();
        $('input#save3').attr('disabled','disabled');
        $('input#ucedula').removeAttr('disabled');
        $('input#ucedula').focus();
        $('#tableContainer3 > table > tbody').html(null);
        $('select#urango > option').removeAttr('selected');
        $('select#urango > option:eq(0)').attr('selected','selected');
    });
    /*
    *   REGISTRA CAMBIOS EN UCEDULA - UNOMBRE - UCLAVE
    */
    $('input#ucedula,input#unombre,input#uclave').keyup(function(e){ actsave3(); });
    /*
    *   BOTON GUARDAR
    */
    $('input#save3').click(function(e){ sendform3(); });
});
