const fs = require("fs");
const PDFDocument = require("pdfkit");
const { convertToWords } = require("./utils/functions");
var totalTaxValue = 0;
function createInvoicePdf(invoice, path) {
    return new Promise((resolve) => {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
        totalTaxValue = 0

        generateHeader(doc);
        generateCustomerInformation(doc, invoice);
        billingTable(doc, invoice);
        generateInvoiceTable(doc, invoice);

        doc.end();
        doc.pipe(fs.createWriteStream(path));
        resolve({ message: 'Success' })
    })
}



function generateHeader(doc) {
    doc
        .rect(25, 20, 545, 680)
        .stroke()
        .fontSize(20)
        .fillColor('#e87b07')
        .font("Helvetica-Bold")
        .text("SRI LAKSHMI VINAYAKA DOORS", 40, 40, { align: "center" })
        .fillColor("black")
        .font("Helvetica")
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    const { invoiceId, invoiceDate } = invoice
    doc
        .fillColor("#444444")
    generateHr(doc, 70);

    const customerInformationTop = 80;

    doc
        .fontSize(10)
        .text("Invoice No: " + invoiceId, 420, customerInformationTop)
        .text("Invoice Date: " + formatDate(invoiceDate), 30, customerInformationTop)
        .font("Helvetica-Bold")
        .moveDown();
    generateHr(doc, 100);
}

function billingTable(doc, invoice) {
    const { customerName = "" } = invoice
    const billingInfoTop = 105;

    doc
        .text(`To : ${customerName}`, 30, billingInfoTop + 5)
    generateHr(doc, billingInfoTop + 18);
}

function generateInvoiceTable(doc, invoice) {
    let subTotal = 0;
    let invoiceTableTop = 135;
    const { products } = invoice

    doc.font("Helvetica-Bold");
    generateIndividualTableRow(
        doc,
        invoiceTableTop,
        "Type of Product",
        "Design",
        "Size",
        "Qty",
        "Sq.ft",
        "Sq.ft Rate",
        "Amount"
    )
    generateHr(doc, invoiceTableTop + 20);

    doc.font("Helvetica");
    let j = 0, extraLength = 0, prevDesignLength = 0
    products.map((item, i) => {
        const { productPrice, designNo } = item
        subTotal = subTotal + productPrice
        let calculatedLength = (designNo.length > 6 && prevDesignLength > 6) ?
            (designNo.length / 6) * 5 : (prevDesignLength < 6 && prevDesignLength != 0 && designNo.length > 6) ?
                ((designNo.length / 6) * 5) - 20 : (prevDesignLength > 6 || designNo.length > 6) ? 25 : 5
        extraLength = i != 0 ? extraLength + calculatedLength : 0
        prevDesignLength = designNo.length
        renderProductRow(doc, invoiceTableTop + 27, j, item, extraLength)
        j++;
    })


    function renderProductRow(doc, invoiceTableTop, j, item) {
        const { productName: product, designNo, productPrice: price, quantity, actualHeight = 0, actualWidth = 0, squareFeet = 0, amount = 0 } = item

        const position = invoiceTableTop + extraLength + j * 12;
        if (position == 60) {
            doc.addPage();
        }
        if (position >= 780) {
            invoiceTableTop = 0;
            j = 0;
        }
        generateIndividualTableRow(
            doc,
            position,
            product,
            designNo,
            `${actualHeight} X ${actualWidth}`,
            quantity,
            squareFeet,
            price,
            amount
        )
        totalTaxValue = totalTaxValue + amount
    }
    let totalAmount = totalTaxValue
    const subtotalPosition = (invoiceTableTop + 530);
    generateHr(doc, subtotalPosition)
    const grandTotal = Math.round(totalAmount)
    doc
        .text("Total in Words Rs :", 30, subtotalPosition + 5)
        .font("Helvetica")
        .fontSize(12)
        .text("Grand Total: ", 400, subtotalPosition + 10)
        .fillColor("red")
        .text(grandTotal, 490, subtotalPosition + 10)
        .fontSize(10)
        .text(convertToWords(grandTotal), 30, subtotalPosition + 20)
}


function generateIndividualTableRow(
    doc,
    y,
    product,
    designNo,
    size,
    quantity,
    squareFeet,
    price,
    taxValue
) {
    generateVr(doc, 150, 122, 543)
    generateVr(doc, 220, 122, 543)
    generateVr(doc, 290, 122, 543)
    generateVr(doc, 340, 122, 543)
    generateVr(doc, 410, 122, 543)
    generateVr(doc, 490, 122, 543)
    doc
        .fontSize(9)
        .text(product, 40, y, { align: "center", width: 90 })
        .text(designNo, 155, y, { align: "center", width: 55 })
        .text(size, 230, y, { align: "center", width: 50 })
        .text(quantity, 290, y, { align: "center", width: 50 })
        .text(squareFeet, 350, y, { align: "center", width: 50 })
        .text(price, 425, y, { align: "center", width: 50 })
        .text(taxValue, 505, y, { align: "center", width: 50 })
}

function generateHr(doc, y) {
    doc
        .lineWidth(1)
        .moveTo(25, y)
        .lineTo(570, y)
        .stroke();
}
function generateVr(doc, xAxis, yAxis, height) {
    doc
        .rect(xAxis, yAxis, 0, height)
}


function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + "/" + month + "/" + year;
}

module.exports = {
    createInvoicePdf
};