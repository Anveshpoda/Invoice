var mongoose = require('mongoose');
var Schema = mongoose.Schema

var PurchaseInvoiceSchema = new Schema({
    invoiceId: String,
    createdDateTime: { type: Date, default: Date.now },
    invoiceDate: Date,
    totalAmount: Number,
    productType: String,
    invoiceMedia: String
}, { collection: "GeneralPurchaseInvoices" });


var PurchaseInvoiceModel = mongoose.model('GeneralPurchaseInvoices', PurchaseInvoiceSchema);
module.exports = PurchaseInvoiceModel;