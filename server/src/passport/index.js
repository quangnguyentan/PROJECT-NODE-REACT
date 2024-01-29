import passport from "passport";
import User from "../models/user";
import { v4 as uuidv4 } from "uuid";
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

require("dotenv").config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      let tokenLogin = uuidv4();
      profile.tokenLogin = tokenLogin;
      try {
        if (profile?.id) {
          let user = await User.findOne({ id: profile.id });
          if (!user) {
            await User.create({
              id: profile.id,
              email: profile.emails[0]?.value,
              typeLogin: profile?.provider,
              avatar: profile.photos[0]?.value,
              fullname: profile?.displayName,
              tokenLogin,
            });
          } else {
            await User.updateOne({ id: profile.id }, { $set: { tokenLogin } });
          }
        }
      } catch (error) {
        console.log(error);
      }
      return cb(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["email", "photos", "id", "displayName"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      let tokenLogin = uuidv4();
      profile.tokenLogin = tokenLogin;
      try {
        if (profile?.id) {
          let user = await User.findOne({ id: profile.id });
          if (!user) {
            await User.create({
              id: profile.id,
              email: profile.emails[0]?.value,
              typeLogin: profile?.provider,
              avatar: profile.photos[0]?.value,
              fullname: profile?.displayName,
              tokenLogin,
            });
          } else {
            await User.updateOne({ id: profile.id }, { $set: { tokenLogin } });
          }
        }
      } catch (error) {
        console.log(error);
      }
      cb(null, profile);
    }
  )
);
