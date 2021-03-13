'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
    productos: [{
        idProductos: {type: Schema.Types.ObjectId, ref: 'productos'},
        cantidad: {type: Number, default:0}
    }],
    total: {type: Number, default:0}
})

module.exports = mongoose.model('carritos',CarritoSchema);