const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
var path = require('path');
const port = 7878;

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '60mb', extended: true }));

app.use(bodyParser.json({ limit: '60mb', extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')));

mongoose.connect('mongodb://srikanth:sri2345@13.233.231.157:27017/personal', { useNewUrlParser: true }, (err, connected) => {
    if (!err) console.log('Mongodb Connected')
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/invoice', require('./server/invoices'))
app.use('/purchaseInvoice', require('./server/purchaseInvoice'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    res.json({ status: 404, message: "API Not Found" });
});
process.on('uncaughtException', function (err) {
    console.log(err);
})


//app server to listen to the port
app.listen(port, () => console.log(`app listening on port ${port}!`))

