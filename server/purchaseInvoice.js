var express = require('express');
const PurchaseInvoiceModel = require('./models/purchaseInvoices');
const ProductsModel = require('./models/products');
const { createInvoicePdf } = require('./createInvoicePdf')
var router = express.Router();
const fs = require("fs");
const ObjectId = require('mongodb').ObjectID


router.get('/getInvoicesCount', (req, res) => {
    PurchaseInvoiceModel.count({}).exec((err, count) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: count })
    })
});

router.get('/getInvoices', (req, res) => {
    const { limit, offset } = req.query
    PurchaseInvoiceModel.find({}).sort({ createdDateTime: -1 }).skip(parseInt(offset)).limit(parseInt(limit)).exec((err, data) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: data })
    })
});

router.get('/getInvoiceById/:invoiceId', (req, res) => {
    PurchaseInvoiceModel.findOne({ _id: ObjectId(req.params.invoiceId) }).exec((err, data) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else {
            res.json(data)
        }
    })
});

router.post('/createInvoice', (req, res) => {
    let invoice = new PurchaseInvoiceModel(req.body);
    invoice.save((err, data) => {
        if (err) res.json({ status: 400, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: data })
    })
});

router.post('/updateInvoice', (req, res) => {
    PurchaseInvoiceModel.findOneAndUpdate({ _id: ObjectId(req.body._id) }, req.body, { new: true }, (err, data) => {
        if (err) res.json({ status: 400, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: data })
    })
});

module.exports = router;
