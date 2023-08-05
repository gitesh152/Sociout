import passport from "passport";
import GooglePassport from "passport-google-oauth";
const GooglePassportStrategy = GooglePassport.OAuth2Strategy
import User from "../models/User.js";
import crypto from "crypto";
import dns from "dns";

dns.lookupService(
  process.env.IP === "localhost" ? "127.0.0.1" : "process.env.IP", //lookup for localhost (127.0.0.1) or public ip
  process.env.PORT,
  (err, hostname, service) => {
    // console.log(hostname, service);

    let dnsUrl = process.env.IP === "localhost" ? process.env.IP : hostname.split(" ");
    //Getting dnsUrl for Amazon EC2 isntance deployment
    passport.use(
      new GooglePassportStrategy(
        {
          clientID:
            process.env.SOCIOUT_GMAIL_CLIENT_ID,
          clientSecret: process.env.SOCIOUT_GMAIL_CLIENT_SECRET,
          callbackURL: `http://${dnsUrl}/auth/google/callback`,
        },
        async (acessToken, refreshToken, profile, done) => {
          try {
            //accesstoken- it is same as we were generating and using it in JWT, sending it in header
            //refreshtoken- if accesstoken expires then use it to get new accesstoken
            let isUser = await User.findOne({ email: profile.emails[0].value });
            if (isUser) {
              return done(null, isUser);
            } else {
              let newUser = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: crypto.randomBytes(20).toString("hex"),
              });
              return done(null, newUser);
            }
          } catch (error) {
            if (error) {
              req.flash("error", "Error while finding user --> passport");
              console.log("Error while finding user --> passport");
              return done(error);
            }
          }
        }
      )
    );
  }
);

export default passport;
