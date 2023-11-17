import passport from "passport";
import jwt from 'jsonwebtoken';
const dev = process.env.NODE_ENV !== "production"

export const COOKIE_OPTIONS = {
    httpOnly: true,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    secure: !dev,
    signed: true, 
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
    samSite: "none",
}

export const getToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: eval(process.env.SESSION_EXPIRY),
    })
}

export const getRefreshToken = user => {
    const refreshToken = jwt.sign(user, process.env.REFREH_TOKEN_SECRET, {
        expiresIn: eval(process.env.SESSION_EXPIRY),
    })
    
    return refreshToken
}

exports.verifyUser = passport.authenticate("jwt", { session: false })