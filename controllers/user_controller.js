import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Friendship from "../models/Friendship.js";
import { newPassword, newUpdates } from "../mailers/mailer.js";

const profile = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    let friends = new Array();
    if (req.user) {
      await req.user.populate({
        path: 'friendship',
        populate: { path: 'from_user to_user' },
      });
      //If friend of user, then push it to friend array
      for (let f of req.user.friendship) {
        if (req.user.id == f.from_user.id)
          friends.push({ userFriendshipId: f.id, userFriend: f.to_user });
        else if (req.user.id == f.to_user.id) {
          friends.push({ userFriendshipId: f.id, userFriend: f.from_user });
        }
      }
    }


    //Getting Relationship
    let isSender = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.params.id,
    });
    let isReceiver = await Friendship.findOne({
      to_user: req.user.id,
      from_user: req.params.id,
    });

    let friend = isSender || isReceiver;

    let users = await User.find({});

    return res.render("user_profile", { profile_user: user, users, friends, friend });
  } catch (error) {
    return res.redirect("back");
  }
};

const signIn = (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", "Already Logged In. !!!");
    return res.redirect("/");
  }
  return res.render("user_sign_in");
};

const signUp = (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", "Already Logged In. !!!");
    return res.redirect("/");
  }
  return res.render("user_sign_up");
};

const signOut = (req, res, next) => {
  req.flash("success", "Logged Out Successfully.");
  req.logout(function (err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });

  // //Below method will delete session cookie also
  // req.session.destroy(function (err) {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.clearCookie("codeial");
  //   console.log("Logged Out Successfully. !!!");
  //   return res.redirect("/user/sign-in");
  // });
};
const createSession = async (req, res) => {
  req.flash("success", "Logged In Successfully.");
  return res.redirect("/");
};

const create = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Password does not match !!!");
      console.log("Password does not match");
      return res.redirect("back");
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      req.flash("error", "User already exist !!!");
      console.log("User already exist !!!");
      return res.redirect("back");
    }
    let newUser = await User.create(req.body);
    if (newUser) {
      req.flash("success", "Created new user !!!");
      console.log("Created new user !!!", newUser);
      return res.redirect("/user/sign-in");
    }
    req.flash("error", "Could not signup !!!");
    console.log("Could not signup !!!");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    return res.redirect("back");
  }
};

//Update User
const update = async (req, res) => {
  try {
    if (req.user.id == req.params.id) {
      let user = await User.findById(req.params.id);
      User.uploadAvatar(req, res, async function (error) {
        if (error) {
          req.flash("error", "****** Multer Error *******");
          return console.log("****** Multer Error *******", error);
        }
        user.name = req.body.name || user.name;
        user.country = req.body.country || user.country;
        console.log(req.body)
        // user.email = req.body.email; //We should not update email
        if (req.file) {
          if (
            user.avatar &&
            fs.existsSync(path.join(__dirname, "..", user.avatar))
          ) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        await user.save();
        newUpdates(user);
        req.flash("success", "Profile updated successfully !!!");
        return res.redirect("back");
      });
    } else {
      req.flash("error", "You are not authorized !!!");
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    req.flash("error", "Could not update profile !!!");
    return res.redirect("back");
  }
};

//Change Password
const changePassword = async (req, res) => {
  try {
    if (req.user.id == req.params.id) {
      const user = await User.findById(req.params.id);
      if (user.password !== req.body.password) {
        req.flash("error", "Incorrect Current Password !!!");
      } else {
        user.password = req.body.newpassword;
        await user.save();
        newPassword(user);
        req.flash("success", "Password updated successfully !!!");
      }
      return res.redirect("back");
    } else {
      req.flash("error", "You are not authorized !!!");
      return res.status(401).send("Unauthorized");
    }
  }
  catch (error) {
    req.flash("error", "Could not update password !!!");
    return res.redirect("back");
  }
}

const contact = async (req, res) => {
  try {
    return res.render('contact')
  }
  catch (error) {
    req.flash("error", "Could not load contact !!!");
    return res.redirect("back");
  }
}

const faq = async (req, res) => {
  try {
    return res.render('faq')
  }
  catch (error) {
    req.flash("error", "Could not load faq !!!");
    return res.redirect("back");
  }
}

export { profile, update, changePassword, signIn, signUp, signOut, create, createSession, contact, faq }