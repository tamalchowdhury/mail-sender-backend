const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { config } = require('./config');
const EmailService = require('./services/EmailService');
const FROM_EMAIL = process.env.FROM_EMAIL || config.FROM_EMAIL;
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.json({ info: 'Working successfully' });
});

/**
 * The sendmail POST controller
 */
app.post('/sendmail', async function (req, res) {
  const emailService = new EmailService();
  const { to, subject, doc } = req.body;
  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Intake form client copy',
    text: "Hello this is a test mail from Steven's site",
    html: "<strong>Hello this is a test mail from Steven's site</strong>",
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
  var mailtoclient = await emailService.send(msg);
  // Send to the owner
  msg.to = FROM_EMAIL;
  msg.subject = "Intake form doctor's copy";
  var mailres = await emailService.send(msg);

  if (mailres) {
    res.json(mailres).end();
  } else {
    res.json({ info: 'Mail sent successfully' }).end();
  }
});

app.listen(PORT, () => console.log('Listening on PORT', PORT));
