## Sendgrid Mail Sender

Takes a request from the frontend and sends email to the owner and the submitter

endpoint: `POST /sendmail`

content:

```
{
  to: "email@example.com",
  subject: "subject",
  doc: "base64 encoded document"

}
```
