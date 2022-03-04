/* 
const emailConfig = require('../config/email'); 
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth:{
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});


//utilizar templete de handelbars
transport.use(
    'compile',
    hbs({
      viewEngine: {
        extName: 'handlebars',
        partialsDir: __dirname + '/../views/layouts',
        layoutsDir: __dirname + '/../views/layouts'
      },
      viewPath: __dirname + '/../views/emails',
      extName: '.handlebars'
    })
);

exports.enviar = (opciones) =>{

    const opcionesEmail = {
        from : 'devJobs <noreply@devjobs.com',
        to: opciones.usuario.email, 
        subject: opciones.subject,
        templete: opciones.archivo,
        context: {
            resetUrl: opciones.resetUrl
        }

    }

    const sendMail = util.promisify(transport.sendMail, transport);

    return sendMail.call(transport,opcionesEmail);
}


transporter.use('compile', hbs(options));
//send mail with options
var mail = {
   from: 'from@domain.com',
   to: 'to@domain.com',
   subject: 'Test',
   template: 'email',
   context: {
       name: 'Name'
   }
}
transporter.sendMail(mail);

 */