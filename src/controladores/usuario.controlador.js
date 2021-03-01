'use strict'

const Usuario = require('../modelos/usuarios.model');
const bcrypt = require('bcrypt-nodejs');


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
        })
    }
    
}

module.exports ={
    usuarioDefault,
    agregarUsuario
}