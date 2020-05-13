require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const messages = require('./messages');
const EmailService = require('./services/EmailService');

const FROM_EMAIL = process.env.FROM_EMAIL;
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS, enabling the host and content type
app.use(function (req, res, next) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'http://forms.wisdomoftheheartinc.com'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

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
    res
      .status(200)
      .json({ info: `Mail sent successfully to ${to}` })
      .end();
  }
});

app.listen(PORT, () => console.log('Listening on PORT', PORT));
