const sgMail = require('@sendgrid/mail');

const API_KEY = process.env.API_KEY;

class EmailService {
  constructor() {
    sgMail.setApiKey(API_KEY);
  }

  // Takes a msg object and sends the email
  /**
   *
   * @param {*} msg an object with email configuration
   * @returns Promise with null when email sent successfull,
   * or error object when email failed to sent
   */
  send(msg) {
    return new Promise(function (resolve, reject) {
      sgMail
        .send(msg)
        .then((res) => {
          resolve(null);
        })
        .catch((error) => {
          resolve(error);
        });
    });
  }
}

module.exports = EmailService;
