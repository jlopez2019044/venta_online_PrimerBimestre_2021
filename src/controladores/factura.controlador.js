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
        })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos suficientes para esta accion'})
    }
    
}

module.exports = {
    crearFactura,
    facturasPorUsuario
}