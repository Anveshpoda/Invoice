var express = require('express');
const InvoiceModel = require('./models/invoice');
const ProductsModel = require('./models/products');
const { createInvoicePdf } = require('./createInvoicePdf')
var router = express.Router();
const fs = require("fs");
const ObjectId = require('mongodb').ObjectID


router.get('/getInvoicesCount', (req, res) => {
    InvoiceModel.count({}).exec((err, count) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: count })
    })
});

router.get('/getInvoices', (req, res) => {
    const { limit, offset } = req.query
    InvoiceModel.find({}).sort({ createdDateTime: -1 }).skip(parseInt(offset)).limit(parseInt(limit)).exec((err, data) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: data })
    })
});

router.get('/getProducts', (req, res) => {
    ProductsModel.find({}).exec((err, data) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: data })
    })
});

router.get('/getInvoiceById/:invoiceId', (req, res) => {
    InvoiceModel.findOne({ _id: ObjectId(req.params.invoiceId) }).exec((err, data) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else {
            createInvoicePdf(data, `${data.invoiceId}.pdf`).then(response => {
                setTimeout(() => {
                    let obj = data.toObject()
                    fs.readFile(`${data.invoiceId}.pdf`, (err, result) => {
                        obj.invoicePdf = result
                        if (res) res.json(obj)
                    })
                }, 1500)
            })
            // res.json({ status: 200, message: "Success", data: data })
        }
    })
});

router.get('/getInvoiceId', (req, res) => {
    InvoiceModel.count({}, (err, count) => {
        if (err) res.status(500).json({ status: 500, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", invoiceId: 1000 + Number(count) + 1 })
    })
});

router.post('/createInvoice', (req, res) => {
    let invoice = new InvoiceModel(req.body);
    invoice.save((err, data) => {
        if (err) res.json({ status: 400, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: data })
    })
});

router.post('/updateInvoice', (req, res) => {
    InvoiceModel.findOneAndUpdate({ _id: ObjectId(req.body._id) }, req.body, { new: true }, (err, data) => {
        if (err) res.json({ status: 400, message: "Failure", data: err })
        else res.json({ status: 200, message: "Success", data: data })
    })
});

module.exports = router;
