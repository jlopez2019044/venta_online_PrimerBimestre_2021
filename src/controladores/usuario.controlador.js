'use strict'

const Usuario = require('../modelos/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const usuariosModel = require('../modelos/usuarios.model');

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

module.exports ={
    usuarioDefault
}