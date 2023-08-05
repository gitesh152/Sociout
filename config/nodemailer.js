import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

let smtp = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SOCIOUT_GMAIL_USER,
    pass: process.env.SOCIOUT_GMAIL_PASSWORD,
  },
}

let transporter = nodemailer.createTransport(smtp);

//we will use this function to render template
let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(path.join(__dirname, "../views/mailer", relativePath));
  data,
    function (error, template) {
      if (error) {
        return console.log("Error in rendering template");
      }
      mailHTML = template;
    };
  return mailHTML;
};

export {
  transporter,
  renderTemplate,
};
