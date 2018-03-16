const express = require("express");
const app = express();

app.use("/users", require("./users.route"));
app.use("/excel", require("./excel.route"));
app.use("/word", require("./word.route"));
app.use("/pdf", require("./pdf.route"));
app.use("/uploads", require("./uploads.route"));
app.use("/employee", require("./employee.route"));

app.use("/certifyLetter", require("./certifyLetter/index.route"));
app.use('/loan' , require('./Loan/index.route'));
app.use('/CountryAndEmbassy' , require('./country/index.route'));
app.use('/company' , require('./company/index.route'));
app.use('/sendmail', require('./sendmail/index.route'));
app.use('/update', require('./routeUpdate/index.route'));
app.use('/maternity', require('./Manternity/index.route'));


module.exports = app;