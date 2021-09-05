var mongoose = require('mongoose');
var Schema = mongoose.Schema

var InvoiceSchema = new Schema({
    invoiceId: String,
    createdDateTime: { type: Date, default: Date.now },
    customerName: String,
    invoiceDate: Date,
    address: String,
    phoneNumber: String,
    gstNo: String,
    place: String,
    totalAmount: Number,
    gstPercentage: Number,
    products: [{
         productName: String,
        designNo: String,
        quantity: Number,
        productPrice: Number,
        productHeight: Number,
        actualHeight: Number,
        productWidth: Number,
        actualWidth: Number,
        squareFeet: Number,
        doubleAmount: Number,
        amount: Number
    }]
}, { collection: "GeneralSalesInvoices" });


var InvoiceModel = mongoose.model('GeneralSalesInvoices', InvoiceSchema);
module.exports = InvoiceModel;