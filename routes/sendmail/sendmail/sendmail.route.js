require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb').ObjectId;
const express = require('express');
const path = require('path');
const router = express.Router();

const sendmail = require('sendmail') ({
    logger: {
      debug: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    },
    silent: false,
    // dkim: { // Default: False
    //   privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
    //   keySelector: 'mydomainkey'
    // },
    smtpPort: 25, // Default: 25
    smtpHost: 'stcp-tenidns01.ten.thomsonreuters.com' // Default: -1 - extra smtp host after resolveMX
  });

router.get('/test', (req, res) => {
    res.send('200')
})
router.post('/mail', (req, res) => {
    sendmail({
        from: 'noreply-trhub@thomsonreuters.com',
        to: 'Pitsanu.Limpanachaiphonkul@thomsonreuters.com,Sittikiat.sujitranon@tr.com',
        subject: 'Hello React',
        html: `Hi , <br><br>
                Congratulations!<br>
                <br>
                We want to confirm that you have successfully reserve the <Holiday House> for a period of <Check-In> to <Check-Out>. <br>
                <br>
               Please follow the check-in check-out detail and Holiday House Rules below. For any question, please contact GrpBkkHRServices@thomsonreuters.com <br>
         <br>
                Best regards,`,
      }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
})

module.exports = router;