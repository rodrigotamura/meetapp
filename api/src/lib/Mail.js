import nodemailer from 'nodemailer';
import { resolve } from 'path';
import mailConfig from '../config/mail';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

class Mail {
  constructor(){
    const {host, port, secure, auth} = mailConfig;

    this.transporter = nodemailer.createTransport({
      host, port, secure, auth: auth.user ? auth : null
    });

    // Handlebars
    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails'); // where are our templates
    this.transporter.use(
      'compile', // how do we compile the formatation of our message
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default', // it is in /layout/default.hbs
          extname: '.hbs', // which extension are we using?
        }),

        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message
    });
  }
}

export default new Mail();