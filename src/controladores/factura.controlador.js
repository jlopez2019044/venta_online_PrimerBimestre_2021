'use strict'

const Factura = require('../modelos/facturas.model');
const Carrito = require('../modelos/carritos.model');
const Producto = require('../modelos/productos.model');
const jwt = require('../servicios/jwt');

function crearFactura(req,res) {

    if(req.user.rol === 'ROL_ADMIN'){
        return res.status(500).send({mensaje: 'Los Administradores no poseeen carrito de compras'});
    }else{

        Carrito.findOne({idUsuario:req.user.sub},(err,carritoEncontrado)=>{

            if(carritoEncontrado.total ==0) return res.status(500).send({mensaje: 'No tiene elementos en el carrito'})

            if(err) return res.status(500).send({mensaje: 'Error en la peticion de carrito'});
            if(!carritoEncontrado) return res.status(500).send({mensaje: 'Errror al encontrar el carrito'});       
    
            //SE TRAEN LOS DATOS DE CARRITO A FACTURA
            var facturaModel = new Factura();
            facturaModel.total = carritoEncontrado.total;
            facturaModel.productos = carritoEncontrado.productos;
            facturaModel.idUsuario = carritoEncontrado.idUsuario;

            //SE DESCUENTA DE LOS PRODUCTOS
            for (let i = 0; i < carritoEncontrado.productos.length; i++) {

                var productoIterado = carritoEncontrado.productos[i].idProductos;

                Producto.findById(productoIterado,(err,productoRestado)=>{
    
                        var productoCantidadNuevo = productoRestado.cantidad - carritoEncontrado.productos[i].cantidad;
                        var popularidadNueva = productoRestado.popularidad+1;

                        Producto.updateMany({_id:productoIterado},{cantidad: productoCantidadNuevo,popularidad: popularidadNueva},
                        (err,productoConCantidadNueva)=>{
                            if(err) return res.status(500).send({mensaje: 'Error al descontar los productos del stock'})
                        })
    
                })
                    
            }

            //SE ELIMINA EL CARRITO EXISTENTE, ASI LOS DATOS SE BORRAN TOTALMENTE
            Carrito.findOneAndDelete({idUsuario: req.user.sub},(err,carritoNuevo)=>{
                if(err) return res.status(500).send({mensaje: 'Error al eliminar carrito'});
                if(!carritoNuevo) return res.status(500).send({mensaje: 'Error en la peticion de eliminar carrito'});
            })
    
            //SE CREA EL NUEVO CARRITO, PORQUE EL CLIENTE NO SE PUEDE CREAR SIN UNO
            var carritoModel = new Carrito();
            carritoModel.idUsuario = req.user.sub;

            carritoModel.save((err,carritoNuevo)=>{
                if(err) return res.status(500).send({mensaje: 'Error al crear carrito'});
                if(!carritoNuevo) return res.status(500).send({mensaje: 'Error al crear el nuevo carrito'});
            })

            //SE CREA LA FACTURA
            facturaModel.save((err,facturaGuardada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!facturaGuardada) return res.status(500).send({mensaje: 'Error al guardar la factura'})
                return res.status(500).send({facturaGuardada});
            })

    
        })

    }
    
}

function facturasPorUsuario(req,res) {

    if(req.user.rol ==='ROL_ADMIN'){

        var usuarioId = req.params.idUsuario;

        Factura.find({idUsuario:usuarioId},(err,facturasEncontradas)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!facturasEncontradas) return res.status(500).send({mensaje: 'El usuario no tiene facturas'});
            
            return res.status(200).send({facturasEncontradas});
        }).populate('productos.idProductos','nombre precio')

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos suficientes para esta accion'})
    }
    
}

function buscarProductosDeFactura(req,res) {
    
    var facturaId = req.params.idFactura;

    if(req.user.rol === 'ROL_ADMIN'){

        Factura.findById(facturaId,(err,facturaEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!facturaEncontrada) return res.status(500).send({mensaje: 'No existe la factura'});
    
            return res.status(200).send({facturaEncontrada});
    
        }).populate('productos.idProductos','nombre precio')

    }else{
        return res.status(500).send({mensaje: 'No tiene los permisos necesarios para realizar dicha accion'})
    }

}

function facturaDetallada(req,res) {

    var facturaId = req.params.idFactura;

    if(req.user.rol === 'ROL_CLIENTE'){

        Factura.findById(facturaId,(err,facturaEncontrada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!facturaEncontrada) return res.status(500).send({mensaje: 'No existe la factura'});

            if(facturaEncontrada.idUsuario == req.user.sub){

                return res.status(200).send({facturaEncontrada});

            }else{
                return res.status(500).send({mensaje: 'Esta factura no es de usted'});
            }
    
        }).populate('productos.idProductos','nombre precio')

    }else{
        return res.status(500).send({mensaje: 'Los administradores no pueden acceder a esta funcion'})
    }
    
}

module.exports = {
    crearFactura,
    facturasPorUsuario,
    buscarProductosDeFactura,
    facturaDetallada,
}