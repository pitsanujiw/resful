const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb').ObjectId;

router.use('/send',require('./sendmail/sendmail.route'));

module.exports = router;