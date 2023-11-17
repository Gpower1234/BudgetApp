import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from "mongoose";
const Schema = mongoose.Schema

import passportLocalMongoose from "passport-local-mongoose";

const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    },
})

const User = new Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    authStrategy: {
        type: String,
        default: "local",
    },
    points: {
        type: Number,
        default: "50",
    },
    refreshToken: {
        type: [Session],
    },
})

// Remove refreshToken  from the response
User.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.refreshToken
        return ret
    },
})

User.plugin(passportLocalMongoose)

// Called during login/sign up
passport.use(new LocalStrategy(User.authenticate()))

// Called while after logging in / signing up to set user details in req.user
passport.serializeUser(User.serializeUser())