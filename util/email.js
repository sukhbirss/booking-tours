const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user,url) {
     this.to = user,
     this.firstName = user.name.split(' ')[0];
     this.url = url,
     this.from = 'sukhbir singh <sukhbirsingh@gmail.com>'

  }

  newTransport() {
    if(process.env.NODE_ENV === 'production'){
      return 1;
    }

    // Creating a transporter
    return nodemailer.createTransport({host: process.env.EMAIL_HOST,
                                       port: process.env.EMAIL_PORT,
                                       auth: {
                                        user: process.env.EMAIL_USERNAME,
                                        pass: process.env.EMAIL_PASSWORD
                                      }
                                      })
  }
    async send(template,subject) {
      // 1) render html based on the pug template
      const html = pug.renderFile(`${__dirname}/../views/EMAIL/${template}.pug`,
                                  {
                                     firstName:this.firstName,
                                     url: this.url,
                                     subject
                                  }
      )
      

      // 2) definine emial options
      const mailOptions = {from: 'Sukhbir singh <sukhbirsohal@gmail.com>',
                           to: this.to,
                           subject,
                           html
                        };
    await this.newTransport().sendMail(mailOptions);

    }



    async sendWelcome() {
    await this.send('welcome','welcome to the natours family');
    }

    async sendPasswordReset() {
      await this.send('passwordReset','Reset Your Password');
    }
}
