require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb').ObjectId;
const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require('../../../utility/upload');

function getDate() {
    let d = new Date();
    let year = d.getFullYear().toString();
    let month = d.getMonth() + 1;
    let day = d.getDate().toString();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();

    if (month.toString().length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.toString().length < 2) hour = "0" + hour;
    if (minute.toString().length < 2) minute = "0" + minute;
    if (second.toString().length < 2) second = "0" + second;

    let result = [year, month, day].join("-") + " " + [hour, minute, second].join(":");
    return result;
}

router.get('/', (req, res) => {
    res.end('Carloan');
});

router.post('/addFiles', (req, res) => {
    upload(req, res, (err) => {
        console.log(req.files);

        if (req.files === undefined) throw new Error('files is undefined');
        if (!err) {
            //upload files
            const myFiles = [];
            req.files.forEach((e) => {
                let file = {
                    'typeLoan': 'Car loan',
                    'filename': e.filename,
                    'originalname': e.originalname,
                    'pathFile': path.join(e.destination.split('.').pop(), e.filename),
                    'size': e.size,
                    'mimetype': e.mimetype
                }
                myFiles.push(file);
            })
            MongoClient.connect(process.env.DB_HOSTNAME, (ERR, client) => {
                const db = client.db('digitalHR');
                const fileID = 'FID' + Date.now();
                const myObj = {
                    'filesID': fileID,
                    'files': myFiles
                }
                db.collection('files').insertOne(myObj, (err, data) => {
                    if (err) throw err;
                    if (data.result.n > 0) {
                        res.json({
                            'status': true,
                            'message': 'upload file success',
                            'fileID': fileID
                        });
                        console.log('insert complete');
                        client.close();
                    } else {
                        res.json({
                            'status': false,
                            'message': 'upload file fail'
                        });
                        console.log('insert fail');
                        client.close();
                    }
                })
            });
        } else {
            throw err;
            res.end();
        };
    });
});

router.post('/addFristhand', (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db('digitalHR');
        console.log(req.body);

        let myObj = {
            'ticketID': 'TID' + Date.now(),
            'createdAt': getDate(),
            'status': req.body.status,
            'typeLoan': req.body.typeLoan,
            'owner': {
                'employeeID': req.body.owner.employeeID,
                'NationalID': req.body.owner.NationalID,
                'GivenName': req.body.owner.GivenName,
                'FamilyName': req.body.owner.FamilyName,
                'mailAddress': req.body.owner.mailAddress,
                'RequestAmount': req.body.owner.RequestAmount,
                'typeOfCar': req.body.owner.typeOfCar,
                'Supportingdoc': {
                    'filesIDDoc': req.body.owner.Supportingdoc.fileIDDoc,
                    'DetailDoc': req.body.owner.Supportingdoc.DetailDoc,
                    'filesCertify': req.body.owner.Supportingdoc.filesIDOther,
                    'DetailCertify': req.body.owner.Supportingdoc.DetailCertify
                }
            }
        }
        db.collection('Loan').insertOne(myObj, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({
                    'status': true,
                    'message': `${data.insertedCount} Inserted `
                });
                console.log('insert complete');
                client.close();
            } else {
                res.json({
                    'status': false,
                    'message': `${data.insertedCount} Inserted `
                });
                console.log('insert fail');
                client.close();
            }
        })
    })
});


router.post('/addUsedhand', (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db('digitalHR');
        console.log(req.body);

        let myObj = {
            'ticketID': 'TID' + Date.now(),
            'createdAt': getDate(),
            'status': req.body.status,
            'typeLoan': req.body.typeLoan,
            'owner': {
                'employeeID': req.body.owner.employeeID,
                'NationalID': req.body.owner.NationalID,
                'GivenName': req.body.owner.GivenName,
                'FamilyName': req.body.owner.FamilyName,
                'mailAddress': req.body.owner.mailAddress,
                'RequestAmount': req.body.owner.RequestAmount,
                'typeOfCar': req.body.owner.typeOfCar,
                'Supportingdoc': {
                    'fileIDCarPurchase': req.body.owner.Supportingdoc.fileIDCarPurchase,
                    'DetailCarPurchase': req.body.owner.Supportingdoc.DetailCarPurchase,
                    'fileIDRegistersCar': req.body.owner.Supportingdoc.fileIDRegistersCar,
                    'DetailRegistersCar': req.body.owner.Supportingdoc.DetailRegistersCar,
                    'fileIDnationalID': req.body.owner.Supportingdoc.fileIDnationalID,
                    'DetailnationalID': req.body.owner.Supportingdoc.DetailnationalID,
                    'fileOther': req.body.owner.Supportingdoc.fileOther,
                }
            }
        }
        db.collection('Loan').insertOne(myObj, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({
                    'status': true,
                    'message': `${data.insertedCount} Inserted `
                });
                console.log('insert complete');
                client.close();
            } else {
                res.json({
                    'status': false,
                    'message': `${data.insertedCount} Inserted `
                });
                console.log('insert fail');
                client.close();
            }
        })
    })
});

//for admin
router.get('/show', (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db('digitalHR');
        db.collection('Loan').find({
            'typeLoan': 'CarLoan'
        }).toArray((err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.json({
                    'status': true,
                    'message': data
                });
                client.close();
                console.log('find complete');
            } else {
                res.json({
                    'status': false,
                    'message': data
                })
                console.log('find fail');
            }
        })
    })
})

router.put("/update", (req, res) => {
    let ticketID = req.body.ticketID;
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("Loan").updateOne({
            "ticketID": ticketID
        }, {
            $set: req.body
        }, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({
                    "status": true,
                    "message": `${data.modifiedCount} Updated`
                });
                console.log("insert complete");
                client.close();
            } else {
                res.json({
                    "status": false,
                    "message": `${data.modifiedCount} Updated`
                });
                console.log("insert fail");
                client.close();
            }
        })
    });
})

module.exports = router;