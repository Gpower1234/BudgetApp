import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import './utils/db.js';
import passport from 'passport';
import './strategies/JwtStrategy.js';
import './strategies/LocalStrategy.js';
import userRouter from './routes/userRoutes.js';

if (process.env.NODE_ENV !== "production") {
    // Load environment varaibles from .env file in non production environments
    config();
}

app.use("/users", userRouter)

app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

// add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(",") : []

const users = [
    {
        id: 1,
        username: 'user1',
        password: '$power4u#$',
    },
    {
        id: 2,
        username: 'user2',
        password: '@ultimate4life',

    }
]


const GOOGLE_CLIENT_ID = 'your google client id';

const GOOGLE_CLIENT_SECRET = 'your google client secret';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}
));

passport.use(new LocalStrategy((username, password, done) => {
    // Find the user with the given name
    const user = users.find(u => u.username === username);

    if (!user) {
        return done(null, false, { message: 'Incorrect username.'})
    }

    // Check if the password matches the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return done(err);
        }
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.'})
        }
        return done(null, user);
    });
}));

Serialize and deserialize user (required for session support, if needed)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
})



AdminJS.registerAdapter({ Database, Resource })
import MySQLStore from 'express-mysql-session';
import userResource from './resources/User.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (res, req) => {
        res.redirect('http://localhost:3000/success');
    }

);

app.post('auth/local', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    (res, req) => {
        // Redirect to the React frontend with the user data after successful login
        res.redirect('http://localhost:5000')
    }
);

Registration endpoint
app.post('/auth/register',  (res, req) => {
    const { username, email, password } = req.body;

    // Check if the username or email is already taken
    if (users.some(user => user.username === username || user.email === email)) {
        return res.status(409).json({ message: 'Username or Email already taken.'})
    }

    // Generate a salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return res.status(500).json({ message: 'Internal server error.' });
        }

        bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error.' })
            }

            // Store the user data in database (replace this with actual database operation)
            const newUser = {
                id: users.length + 1,
                username,
                fullName,
                email,
                password: hashedPassword,
            };

            users.push(newUser);

            return res.json({ message: 'Registration successful.' });
        });
    });
});

Import and configure your data models (ResourceOptions)

AdminJS.registerAdapter(AdminJSAdapterSequelize);

const sessionStore = new MySQLStore({}, sequelize);

Configure the AdminJS options 

(async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized successfully.');
    } catch (err) {
        console.error('Error sunchronizing the database', err);
    }
})

const adminJsOptions = new AdminJS({
    rootPath: '/admin',
    // Example resource for a 'users' table
 
    resource: User, 
    options: {
    properties: {
        name: {type: 'string'},
        email: {type: 'string'},
        createdAt: {isVisible: true},
        updatedAt: {isVisible: false},
    }
},

    
});

const router = AdminJSExpress.buildRouter(adminJsOptions);


const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed bt CORS"))
        }
    },

    credentials: true,
};

/*
mongoose.connect("mongodb://localhost:27017/budgeting", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to the database'); 
    })

    .catch((err) => {
        console.error('Failed to connect to the database', err)
    });
*/

JWT_SECRET = jdhdhd-kjfjdhrhrerj-uurhr-jjge
REFRESH_TOKEN_SECRET = fgkjddshfdjh773bdjsj84-jdjd774
SESSION_EXPIRY = 60 * 15
REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 30
MONGO_DB_CONNECTION_STRING = mongodb://127.0.0.1:27017/mern_auth
COOKIE_SECRET = jhdshhds884hfhhs-ew6dhjd
WHITELISTED_DOMAINS = http://localhost:3000

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
 try {
   const ticket = await client.verifyIdToken({
     idToken: token,
     audience: GOOGLE_CLIENT_ID,
   });
   return { payload: ticket.getPayload() };
 } catch (error) {
   return { error: "Invalid user detected. Please try again" };
 }
}

app.post("/signup", async (req, res) => {
    try {
      // console.log({ verified: verifyGoogleToken(req.body.credential) });
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
  
        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }
  
        const profile = verificationResponse?.payload;
  
        DB.push(profile);
  
        res.status(201).json({
          message: "Signup was successful",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            token: jwt.sign({ email: profile?.email }, "myScret", {
              expiresIn: "1d",
            }),
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred. Registration failed.",
      });
    }
  });

app.post("/login", async (req, res) => {
    try {
        if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
        if (verificationResponse.error) {
            return res.status(400).json({
            message: verificationResponse.error,
            });
        }

        const profile = verificationResponse?.payload;

        const existsInDB = DB.find((person) => person?.email === profile?.email);

        if (!existsInDB) {
            return res.status(400).json({
            message: "You are not registered. Please sign up",
            });
        }

        res.status(201).json({
            message: "Login was successful",
            user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            }),
            },
        });
        }
    } catch (error) {
        res.status(500).json({
        message: error?.message || error,
        });
    }
});

let DB = [];


app.post('/', async function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://localhost:3000');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const redirectUrl = 'http://127.0.0.1:5000/oauth';

    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl,
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent'
    });

    res.json({url:authorizeUrl})
})