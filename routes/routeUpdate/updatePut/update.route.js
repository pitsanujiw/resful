require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb').ObjectId;
const express = require('express');
const path = require('path');
const router = express.Router();


router.put("/updatesCertifyLetter", (req, res) => {
    console.log(req.body);
    let ticketID = req.body.ticketID;
    let type = req.body.typeCertifyLetter;
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("certifyLetter").updateOne({ "ticketID": ticketID }, { $set: req.body }, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({ "status": true, "message": `${data.modifiedCount} Updated` });
                console.log("insert complete");
                client.close();
            } else {
                res.json({ "status": false, "message": `${data.modifiedCount} Updated` });
                console.log("insert fail");
                client.close();
            }
        })
    });
})

router.put("/updatesLoan", (req, res) => {
    console.log(req.body);
    let ticketID = req.body.ticketID;
    let type = req.body.typeCertifyLetter;
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("Loan").updateMany({ "ticketID": ticketID,"typeCertifyLetter": type }, { $set: req.body }, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({ "status": true, "message": `${data.modifiedCount} Updated` });
                console.log("insert complete");
                client.close();
            } else {
                res.json({ "status": false, "message": `${data.modifiedCount} Updated` });
                console.log("insert fail");
                client.close();
            }
        })
    });
})

module.exports = router;