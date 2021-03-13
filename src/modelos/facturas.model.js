'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var facturaSchema = Schema({
    total: Number,
    productos: [{
        idProductos: {type: Schema.Types.ObjectId, ref: 'productos'},
        cantidad: {type: Number, default: 0}
    }],
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'}
})

module.exports = mongoose.model('facturas',facturaSchema);