var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ProductsSchema = new Schema({
    productName: String
}, { collection: "products" });


var InvoiceModel = mongoose.model('products', ProductsSchema);
module.exports = InvoiceModel;