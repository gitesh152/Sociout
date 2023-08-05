import passport from "passport";
import User from "../models/User.js";
import passportJwt from 'passport-jwt';
const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;

//We encrypt using a key
let opts = {
  //here header has list of keys, among those authorization is also a key, this authorization also has a lot of keys, with key bearer.
  //this bearer will keep token
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new jwtStrategy(opts, async function (jwtPayload, done) {

    try {
      let user = await User.findById(jwtPayload._id);
      if (user) {
        if (user) return done(null, user);
      }
      else {
        console.log('yaha');
        return done(null, false);
      }
    }
    catch (err) {
      console.log("Error finding user from JWT");
      return done(err, false);
    }
  })
);

export default passport;
