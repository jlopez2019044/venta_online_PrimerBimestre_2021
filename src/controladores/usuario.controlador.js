'use strict'

const Usuario = require('../modelos/usuarios.model');
const Carrito = require('../modelos/carritos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../servicios/jwt');
const usuarioModelos = require('../modelos/usuarios.model')


//FUNCION PARA CREAR EL USUARIO PREDETERMINADO
function usuarioDefault(req,res){

    let usuarioModel = new Usuario();
    usuarioModel.usuario = 'ADMIN';
    usuarioModel.password = '123456';
    usuarioModel.rol = 'ROL_ADMIN'

    Usuario.find({$or: [
        {usuario: usuarioModel.usuario},
        {rol: usuarioModel.rol}
    ]}).exec((err, usuariosEncontrados)=>{
            
        if(err) return console.log('Error en la petición del usuario')
        if(usuariosEncontrados && usuariosEncontrados.length>=1){
            console.log("Usuario ADMIN ya está creado")
        }else{
            bcrypt.hash(usuarioModel.password,null,null,(err,passwordEncriptada)=>{
                usuarioModel.password = passwordEncriptada;
            })
    
            usuarioModel.save((err, usuarioGuardado)=>{
                if(err) return console.log("Error al guardar el usuario");
    
                if(usuarioGuardado){
                    console.log('usuario Guardado '+usuarioGuardado);
                }
            })
        }

    })

}

function login(req,res) {

    var params = req.body;

    Usuario.findOne({usuario: params.usuario},(err,usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición'})

        if(usuarioEncontrado){
            bcrypt.compare(params.password,usuarioEncontrado.password,(err,passCorrecta)=>{

                if(passCorrecta){

                    Usuario.findOne({usuario: params.usuario},(err,usuarioParaCarrito)=>{

                        if(usuarioParaCarrito.rol === 'ROL_CLIENTE'){

                            Carrito.findOne({idUsuario: usuarioParaCarrito._id},(err,carritoParaUsuario)=>{

                                if(!carritoParaUsuario){
    
                                    let carritoModel = new Carrito();
    
                                    carritoModel.idUsuario = usuarioParaCarrito._id;
    
                                    carritoModel.save((err,carritoGuardado)=>{
                                        if(err) return res.status(500).send({mensaje:  'Error al crear el carrito del usuario'});
                                    })
    
                                }
    
                            })

                        }

                    })

                    if(params.obtenerToken ==='true'){
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        });
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado})
                    }
                }else{
                    return res.status(404).send({mensaje: 'El usuario no se ha podido identificar'})
                }

            })
        }else{
            return res.status(404).send({mensaje: 'El usuario no ha podido ingresar'})
        }

    })
    
}

function agregarUsuario(req,res) {

    var usuarioModel = new Usuario();
    var params = req.body;

    if(params.usuario && params.password){
        usuarioModel.usuario = params.usuario;
        usuarioModel.password = params.password
        usuarioModel.rol = 'ROL_ADMIN'

        Usuario.find({$or: [
            {usuario: usuarioModel.usuario}
        ]}).exec((err, usuariosEncontrados)=>{

            if(req.user.rol === 'ROL_ADMIN'){

                if(err) return res.status(500).send({mensaje: 'Error en la petición del usuario'})

            if(usuariosEncontrados && usuariosEncontrados.length>=1){
                return res.status(500).send({mensaje: 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err,passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;
                })

                usuarioModel.save((err,usuarioGuardado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al guardar el usuario'});

                    if(usuarioGuardado){
                        return res.status(200).send({usuarioGuardado})
                    }else{
                        res.status(404).send({mensaje: 'No se ha podido registrar el usuario'})
                    }

                })
            }

            }else{
                return res.status(500).send({mensaje: 'No es un Administrador así que no puede crear uno'})
            }

        })
    }
    
}

function registrarCliente(req,res) {

    var usuarioModel =new Usuario();
    var params = req.body;

    if(params.usuario && params.password){

        usuarioModel.usuario = params.usuario;
        usuarioModel.password = params.password;
        usuarioModel.rol = 'ROL_CLIENTE';

        Usuario.find({$or: [
            {usuario: usuarioModel.usuario}
        ]}).exec((err,usuariosEncontrados)=>{

            if(err) return console.log('Error en la peticion de usuario');

            if(usuariosEncontrados && usuariosEncontrados.length>=1){
                return res.status(500).send({mensaje: 'El usuario ya está creado'})
            }else{
                bcrypt.hash(usuarioModel.password,null,null,(err,passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;
                })

                usuarioModel.save((err,usuarioGuardado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al guardar el usuario'});

                    if(usuarioGuardado){
                        return res.status(200).send({usuarioGuardado});
                    }

                })

            }

        })

    }else{
        return res.status(500).send({mensaje: 'Necesita llenar los datos'})
    }
} 

function editarCliente(req,res) {
    
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    delete params.password;

        if(idUsuario === req.user.sub){

            delete params.rol;

            Usuario.findByIdAndUpdate(idUsuario,params,{new: true, useFindAndModify: false},(err,usuarioActualizado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                if(!usuarioActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar al usuario'})
                return res.status(200).send({usuarioActualizado})
            })

        }else{

            if(req.user.rol === 'ROL_ADMIN'){

                Usuario.findByIdAndUpdate(idUsuario,params,{new: true, useFindAndModify: false},(err,usuarioActualizado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                    if(!usuarioActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar al usuario'})
                    return res.status(200).send({usuarioActualizado})
                })

            }else{
                return res.status(500).send({mensaje: 'No posee los permisos necesarios para actualizar el usuario'})
            }

        }
    

}

function eliminarCliente(req,res) {

    var idUsuario = req.params.idUsuario;

    if(idUsuario === req.user.sub || req.user.rol === 'ROL_ADMIN'){

        Carrito.findOneAndDelete({idUsuario:idUsuario},(err,carritoEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error al eliminar el carrito'})
        })

        Usuario.findByIdAndDelete(idUsuario,(err,usuarioEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la petición de eliminar'})
            if(!usuarioEliminado) return res.status(500).send({mensaje: 'Error al eliminar el usuario'})
            return res.status(200).send({usuarioEliminado})
        })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos necesarios para actualizar el usuario'})
    }

}

module.exports ={
    usuarioDefault,
    agregarUsuario,
    login,
    registrarCliente,
    editarCliente,
    eliminarCliente
}