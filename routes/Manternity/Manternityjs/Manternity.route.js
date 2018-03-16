require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;
const express = require("express");
const path = require("path");
const router = express.Router();
const upload = require("../../../utility/upload");


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


router.get('/home', (req, res) => {
    console.log('OK')
    res.end('Manternity');
})

router.post("/addFiles", (req, res) => {
    upload(req, res, (err) => {
        if (req.files === undefined) throw new Error("files is undefined");
        if (!err) {
            //-- upload --//
            const myFiles = [];
            req.files.forEach((e) => {
                let file = {
                    "filename": e.filename,
                    "originalname": e.originalname,
                    "pathFile": path.join(e.destination.split(".").pop(), e.filename),
                    "size": e.size,
                    "mimetype": e.mimetype
                }
                myFiles.push(file);
            })
            //-- upload --//
            // connect mongodb
            MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
                const db = client.db("digitalHR");
                const fileID = "FID" + Date.now();
                const myObj = {
                    "filesID": fileID,
                    "files": myFiles
                }
                db.collection("files").insertOne(myObj, (err, data) => {
                    if (err) throw err;
                    if (data.result.n > 0) {
                        res.json({
                            "status": true,
                            "message": "upload file success",
                            "fileID": fileID
                        });
                        console.log("insert complete");
                        client.close();
                    } else {
                        res.json({
                            "status": false,
                            "message": "upload file fail"
                        });
                        console.log("insert fail");
                        client.close();
                    }
                })
            });
            // connect mongodb
        } else {
            throw err;
            res.end();
        };
    });
});


router.post("/add", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        if (err) throw err;
        console.log(req.body)
        const db = client.db("digitalHR");
        let myObj = {
            'ticketID': 'TID' + Date.now(),
            'createdAt': getDate(),
            "modifiedAt": "-",
            'type': req.body.type,
            'status': req.body.status,
            'owner': {
                'employeeID': req.body.owner.employeeID,
                'GivenName': req.body.owner.GivenName,
                'FamilyName': req.body.owner.FamilyName,
                'PatientStatus': req.body.owner.PatientStatus,
                'date': req.body.owner.date,
                'HospitalName': req.body.owner.HospitalName,
                'TotalExpense': req.body.owner.TotalExpense,
                'TotalClaimable': req.body.owner.TotalClaimable,
                'note': req.body.owner.note,
                'Doc': {
                    'ReceiptFileID': req.body.owner.Doc.ReceiptFileID,
                    'Receipt': req.body.owner.Doc.Receipt,
                    'MedicalCertifyFileId': req.body.owner.Doc.MedicalCertifyFileId,
                    'MedicalCertificate': req.body.owner.Doc.MedicalCertificate
                }
            }
        }
        // let myObj = {
        //     "ticketID": "TID" + Date.now(),
        //     "createdAt": getDate(),
        //     "modifiedAt": "-",
        //     "status": 'req.body.status',
        //     "typeCertifyLetter": 'req.body.typeCertifyLetter',
        //     "owner": {
        //         "employeeID": 'req.body.owner.employeeID', // string
        //         "firstName": 'req.body.owner.firstName',
        //         "lastName": 'req.body.owner.lastName',
        //         "numberOfCopy": 'req.body.owner.numberOfCopy',
        //         "note": 'req.body.owner.note'
        //     }
        // }

        console.log(myObj)
        db.collection("Manternity").insertOne(myObj, (err, data) => {
            if (err) throw err;
            if (data.result.n > 0) {
                res.json({
                    "status": true,
                    "message": `${data.insertedCount} Inserted`
                });
                console.log("insert complete");
                client.close();
            } else {
                res.json({
                    "status": false,
                    "message": `${data.insertedCount} Inserted`
                });
                console.log("insert fail");
                client.close();
            }
        })
    });
});


module.exports = router;