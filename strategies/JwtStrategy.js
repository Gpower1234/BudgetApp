import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
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

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'jdhdhd-kjfjdhrhrerj-uurhr-jjge'

// Used by the authenticated requests to serialize the user
// i.e, to fetch the user details from JWT.

passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
        // Check against the DB only if necessary.
        // This can be avoided if you don't want to fetch user details in each request
        User.findOne({ _id: jwt_payload._id }, function (err, user) {
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
                // or you could create a new account
                
            }
        })
    })
);

export { passport, opts };