require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const messages = require('./messages');
const EmailService = require('./services/EmailService');

const FROM_EMAIL = process.env.FROM_EMAIL;
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const emailService = new EmailService();

app.get('/', function (req, res) {
  res.json({ info: 'Working successfully' });
});

/**
 * The sendmail POST controller
 */
app.post('/sendmail', async function (req, res) {
  const { to, subject, doc } = req.body;

  if (!to || !subject || !doc) {
    res.status(400).json({ info: 'Required fields are missing' }).end();
    return;
  }

  const msg = {
    to,
    from: {
      name: messages.NAME,
      email: FROM_EMAIL,
    },
    subject: messages.SUBJECT_LINE,
    text: messages.OPENING_LINE,
    html: `<strong>${messages.OPENING_LINE}</strong>`,
    attachments: [
      {
        filename: 'IntakeForm.pdf',
        content: doc,
        type: 'application/pdf',
        disposition: 'attachment',
        contentId: 'myId',
      },
    ],
  };
  // Sent to the client
  msg.subject += ' client copy';
  var mailres = await emailService.send(msg);

  // Send to owner
  msg.to = FROM_EMAIL;
  msg.subject = `${messages.SUBJECT_LINE} owner's copy`;
  var newmailres = await emailService.send(msg);

  if (mailres) {
    res.status(mailres.code).json(mailres).end();
  } else {
    res.status(200).json({ info: 'Mail sent successfully' }).end();
  }
});

app.listen(PORT, () => console.log('Listening on PORT', PORT));
