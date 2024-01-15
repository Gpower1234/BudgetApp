import express from 'express';
import session from 'express-session';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router()

async function getUserData(access_token){
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
    const data = await response.json();
    console.log('data', data);
}

/* GET home page */
router.get('/', async function(req, res, next) {
    const code = req.query.code;
    try{
        const redirectUrl = 'http://127.0.0.1:5000/oauth';

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl,
        );
        const res = await oAuth2Client.getToken(code)
        await oAuth2Client.setCredentials(res.tokens)
        console.log('Tokens acquired')
        const user = oAuth2Client.credentials;
        console.log('credentials', user)
        await getUserData(user.access_token)
    }catch(err){
        console.log('Error with signing in with Google')
    }
});

module.exports = router;