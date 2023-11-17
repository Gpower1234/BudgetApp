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