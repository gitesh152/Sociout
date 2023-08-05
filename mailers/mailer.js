import { transporter, renderTemplate } from "../config/nodemailer.js";
import postTemplate from "./templates/new_post.js";
import updateTemplate from "./templates/new_update.js";
import passwordTemplate from "./templates/new_password.js";


let newPosts = (post) => {
  transporter.sendMail(
    {
      from: "ansh1996ansh@gmail.com",
      to: post.user.email,
      subject: "New Post Published ...",
      html: postTemplate(post),
    },
    (error, info) => {
      if (error) return console.log(error);
      // console.log("Mail Sent ", info);
      console.log(`Mail Sent to ${info.accepted}`);
    }
  );
};


let newUpdates = (user) => {
  transporter.sendMail(
    {
      from: "ansh1996ansh@gmail.com",
      to: user.email,
      subject: "User Profile updated ...",
      html: updateTemplate(user),
    },
    (error, info) => {
      if (error) return console.log(error);
      // console.log("Mail Sent ", info);
      console.log(`Mail Sent to ${info.accepted}`);
    }
  );
};

let newPassword = (user) => {
  transporter.sendMail(
    {
      from: "ansh1996ansh@gmail.com",
      to: user.email,
      subject: "User Password updated ...",
      html: passwordTemplate(user),
    },
    (error, info) => {
      if (error) return console.log(error);
      // console.log("Mail Sent ", info);
      console.log(`Mail Sent to ${info.accepted}`);
    }
  );
};

export { newPosts, newUpdates, newPassword }
