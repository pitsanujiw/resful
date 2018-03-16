const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb").ObjectId;

router.use("/countryAndEmbassy", require("./countryAndEmbassy/countryAndEmbassy.route"));

router.get("/all", (req, res) => {
    MongoClient.connect(process.env.DB_HOSTNAME, (err, client) => {
        const db = client.db("digitalHR");
        db.collection("Country").find({}).toArray((err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.json({ "status": true, "message": data });
                client.close();
                console.log("find complete");
            } else {
                res.json({ "status": false, "message": data });
                client.close();
                console.log("find fail");
            }
        })
    })
})

module.exports = router;