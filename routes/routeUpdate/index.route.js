const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb').ObjectId;

router.use('/data',require('./updatePut/update.route'));

module.exports = router;