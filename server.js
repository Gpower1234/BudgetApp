import express from 'express';
// 
import path from 'path';
import cors from 'cors';
import AdminJSExpress from '@adminjs/express';
import AdminJS from 'adminjs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mysql from 'mysql2';
import passport from 'passport';
//import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt'; 
import { default as AdminJSAdapterSequelize } from '@adminjs/sequelize';
import { Database, Resource } from '@adminjs/typeorm' // or any other adapter
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
//import { access } from 'fs';
//import { profile } from 'console';
import MySQLStore from 'express-mysql-session'
dotenv.config();

// Connect to the database

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'budgeting'
})

con.connect(err => {
    if (err){
        console.log("Error connecting to the database", err)
    } else {
        console.log("Database connected")
    }
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router()

// Session configuration (adjust as needed)
const sessionStore = new (MySQLStore(session))({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'budgeting',
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
}, con)

// Set up session
app.use(session({ secret: 'aaecbcff6d6649f4579f7b69bd981ea1a57d7fb58c939061ef02b15e5476c85d', resave: true, saveUninitialized: true, store: sessionStore}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session())

{/*app.use(session({
    secret: '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',
    resave: false,
    saveUninitialized: true,
    //store: sessionStore,
}))*/}

{/*app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: "GET,POST,PUT,DELETE,OPTIONS",
    })
);*/}

app.use(cors())

passport.use(new GoogleStrategy(
    {
        clientID: '634787447613-7em4qk02cj0qs0bcqv68cvhbp9ubtaak.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:5001/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        const {id, displayName, emails} = profile;

        con.query('SELECT * FROM user WHERE google_id = ?', [id], (err, result) => {
            if (err) {
                console.error('Error querying database:', err);
                return done(err, null)
            }

            if (result.length > 0) {
                // User already exists, retrieve user from the database
                const existingUser = result[0];

                // Initiate the login process for existing users
                return done(null, existingUser)
            } else {
                // User doesn't exist, save the new user to the database
                const newUser = {
                    google_id: id,
                    name: displayName,
                    email: emails[0].value,
                };

                con.query('INSERT INTO user SET ?', newUser, (err, result) => {
                    if (err) {
                        console.error('Error inserting into database:', err);
                        return done(err, null)
                    }

                    newUser.id = result.insertId
                    return done(null, newUser)
                })
            }
        })
        
      }
    )
);
  
  
      
// Serialize and deserialize user functions
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser((id, done) => {
    con.query('SELECT * FROM user WHERE google_id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            return done(err, null);
        }
        const user = result[0];
        return done(null, user)
    });
});
  

// Google authentication route
app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'consent' })
);

// Google callback route
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    // Successful authentication, generate a JWT token
    const token = jwt.sign({ userId: req.user.id }, '049a9cdc30580c16461b1ada84678b139cee7ec2ebf0b299d258041cb2b0eaa6', {
        expiresIn: '1h', // Token expiration time (adjust as needed)
    });
    res.redirect(`/?token=${token}`);
    }
);


// Check authentication status route
app.get('/api/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
      // If the user is authenticated, send user information and a JWT token
      const token = jwt.sign({ userId: req.user.id }, '049a9cdc30580c16461b1ada84678b139cee7ec2ebf0b299d258041cb2b0eaa6', {
        expiresIn: '1h', // Token expiration time (adjust as needed)
      });
      res.json({ isAuthenticated: true, user: req.user, token });
    } else {
      // If not authenticated, send appropriate response
      res.json({ isAuthenticated: false });
    }
});
  

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

app.all('/api/googlesignup', (req, res) => {
    // Extract user information from the Google authentication response
    const { email, name } = req.body;

    // Check if the user already exists
    con.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error quering database:', err);
            return res.status(500).json({ message: 'internal server error.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Internal server error' });
        }

        // Insert the new user into the database
        con.query('INSERT INTO user (email, name) VALUES (?, ?)', [email, name ], (err, result) => {
            if (err) {
                console.error('Error inserting into database', err);
                return res.status(500).json({ message: 'Internal server error'})
            }

            const newUser = { email, name };

            // Automatically log in the new user
            req.login(newUser, (err) => {
                if (err) {
                    console.error('Error during login:', err)
                    return res.status(500).json({ message: 'Internal server error' });
                }
            return res.json({ user: newUser });
            });
        });
    });    
});

// ADMIN PANEL SETUP
const adminJsOptions = new AdminJS({
    rootPath: '/admin',
    // Example resource for a 'users' table
 
    //resource: User, 
    options: {
    properties: {
        name: {type: 'string'},
        email: {type: 'string'},
        createdAt: {isVisible: true},
        updatedAt: {isVisible: false},
    }
},
});

const route = AdminJSExpress.buildRouter(adminJsOptions);

app.use(adminJsOptions.options.rootPath, route)

// Generate a secret key
const secretkey = crypto.randomBytes(64).toString('hex');

{/*
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy({
        clientID: 'YOUR GOOGLE CLIENT ID',
        clientSecret: 'YOUR GOOGLE CLIENT SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        // You can save user profile data to the database here
        return done(null, profile);
    }
    )
)

// Route for saving user data after Google authentication
app.get('/auth/google/callback',
   passport.authenticate('google', {failureRedirect: '/'}),
   (req, res) => {
    const user = req.user; // User data from Google authentication
    const { id, name, email } = user;

    // Insert the user data into your database
    con.query(
        'INSERT INTO users (google_id, name, email) VALUES (?, ?, ?)',
        [id, name, email[0].value],
        (error, result)  => {
            if (error) {
                console.error('Error saving user data to the database', error)
            } 
            return res.json({status: "success"})
        }
    )
    // Successful authentication redirect to your React app
    res.redirect('http://localhost:3000')
   }
);


// Local strategy for passport
passport.use(new LocalStrategy(
    (username, password, done) => {
        con.query('SELECT * FROM user WHERE username = ?', [username], (err, rows) => {
            if (err) return done(err);
            if (!rows.length) return done(null, false);
            const user = rows[0];

            // Compare the provided password with the hashed password in the database
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) return done(null, user);
                return done(null, false);
            });
        });
    }
));

// Serialization and deserialization of user data
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    {/*con.query('SELECT * FROM user WHERE id = ?', [id], (err, rows) => {
        if (err) return done(err);
        done(null, rows[0]);
    }); 
    done(null, user);
});

// middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // if user is authenticated, continue to the next middleware or route handler
        console.log('User not Authenticated')
        return next();
    }
    // If not authenticated, send a response indicating that
    res.status(401).json({ authenticated: false });
}

// Create a route for checking authentication status
app.get('/check-auth', isAuthenticated, (req, res) => {
    // If this middleware is reached, it means that the user is authenticated
    res.json({authenticated: true})
    console.log('Authenticated')
})
// ROUTES

//Register route
app.post('/register', (req, res) => {
    const {username, password} = req.body
    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        con.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) throw err;
            res.send('Registration was successful.')
        });
    });
});

// Login route
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log(err)
            return next(err); // Pass the error to the next middleware
        }
        if (!user) {
            console.log('User not found')
            return res.status(401).json({ message: 'Authentiction failed'})
        }
        req.login(user, (err) => {
            if (err) {
                console.log('Failed Login')
                return next(err);
            }
            console.log('Login successful')
            return res.json({ status: 'success', isAuthenticated: true, message: 'Authentication successful'});
        });
    })(req, res, next);
});

*/}

app.post('/create-budget', (req, res) => {

    const { year, month, currency } = req.body;

    const checkIfExistQuery = 'SELECT * FROM monthlybudget WHERE month = ? AND year = ?';
    con.query(checkIfExistQuery, [month, year], (error, results) => {
        if (error) {
            //throw error;
            return res.json({status: 'Query error'})
        }

        if (results.length > 0) {
            // Month and Year combination already exists, send an error response
            return res.json({status: "Month and Year already exist."})
        } else {
            // if not exists, perform the insertion
            const insertQuery = "INSERT INTO monthlybudget ( year, month, currency) VALUES (?, ?, ?)"
            con.query(insertQuery, [ year, month, currency ], (insertError, insertResults) => {
                if (insertError) {
                    //throw insertError;
                    return res.json({status: 'error'})
                } else {
                    return res.json({status: "success"})
                }
            })
        }
    })
    {/*const sql = "INSERT INTO monthlybudget (`year`, `month`, `currency`) VALUES (?)";
    const values = [
        req.body.year,
        req.body.month,
        req.body.currency,
    ]
    console.log(values)
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({Error: err, status: 'error'})
        return res.json({status: "success"})
    })*/}
});

app.post('/add-budget', (req, res) => {
    const sql = "INSERT INTO budget (`name`, `currency`, `est_amount`, `month`, `year`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.symbol,
        req.body.estimated_amount,
        req.body.budget_month,
        req.body.year,
    ]
    con.query(sql, [values], (err, result) => {
        if (err) {
            return res.json({Error: 'error'})
        }
        return res.json({status: 'success'})
    })
})

app.post('/add-expenses', (req, res) => {
    const sql = "INSERT INTO expenses (`item_name`,  `currency`, `amount`, `month`, `year`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.symbol,
        req.body.amount,
        req.body.expenses_month,
        req.body.year
    ]
    console.log(values)
    con.query(sql, [values], (err, result) => {
        if (err) return (console.log(err), res.json({Error: 'error'}))
        return res.json({status: 'success'})
    })
})

app.get('/monthly-budgets', (req, res) => {
    const sql = "SELECT * FROM monthlybudget ORDER BY year DESC, month DESC" // ORDER BY year DESC, CASE WHEN month = 'December', THEN 1 WHEN month = 'November' THEN 2 WHEN month = 'october' THEN 3 WHEN month = 'september' THEN 4 WHEN month = 'August' THEN 5 WHEN month = 'July' THEN 6 WHEN month = 'october'
    con.query(sql, (err, result) => {
        if (err) return (console.log('Error fetching data', err), res.json({Error: 'Retrieval failed'}))
        return res.json({status: 'success', Result: result})
    })
});

app.get('/budget', (req, res) => {
    const sql = "SELECT * FROM budget ORDER BY year, month DESC"
    con.query(sql, (err, result) => {
        if (err) return (console.log('Error fetching data', err), res.json({Error: 'Retrieval failed'}))
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenses', (req, res) => {
    const sql = "SELECT * FROM expenses ORDER BY year, month DESC"
    con.query(sql, (err, result) => {
        if (err) return res.json({Error: 'Retrieval failed'})
        return res.json({status: 'success', Result: result})
    })
});

app.get('/monthly-budget/:month/:year', (req, res) => {
    const id = req.params.month
    const sql = "SELECT * FROM monthlybudget where month = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return (console.log(err), res.json({status: 'Error', Error: 'Server Error'}))
        return res.json({status: 'success', Result: result})
    })
});

app.get('/budget/:month/:year', (req, res) => {
    const {month, year} = req.params;
    const sql = "SELECT * FROM budget where month = ? AND year = ?"
    con.query(sql, [month, year], (err, result) => {
        if (err) return res.json({status: 'Error', Error: 'Server Error'})
        return res.json({status: 'success', Result: result})
    })
});

app.get('/budgetID/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM budget where id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({status: 'Error', Error: 'Server Error'})
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenseID/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM expenses where id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({status: 'Error', Error: 'Server Error'})
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenses/:month/:year', (req, res) => {
    const id = req.params.month
    const sql = "SELECT * FROM expenses where month = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({Error: 'Retrieval failed'})
        return res.json({status: 'success', Result: result})
    })
});

app.put('/update-budget/:id', (req, res) => {
    const id = req.params.id
    const { name, estimated_amount } = req.body

    con.query('UPDATE budget SET name = ?, est_amount = ? WHERE id = ?', [name, estimated_amount, id], (error, results) => {
        if (error) {
            res.status(500).send('Error updating budget')
        } else {
            return res.json({status: "success"})
        }
    })
});

app.put('/update-expense/:id', (req, res) => {
    const id = req.params.id
    const sql = "UPDATE `expenses` SET `item_name`= ?,`amount`=? WHERE id = ?"
    con.query(sql, [req.body.item_name, req.body.amount, id], (err, result) => {
        if (err) return res.json({Error: "Updating error in sql"})
        return res.json({status: "success"})
    })
});

app.delete('/budget-delete/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM budget WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({Error: "Delete budget error in sql"})
        return res.json({status: "success"})
    })
});

app.delete('/expense-delete/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM expenses WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({Error: "Delete expenses error in sql"})
        return res.json({status: "success"})
    })
});

router.post('/api/signup').post( async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).send('User registered successfully')
    }   catch (error) {
        res.status(500).send('Error registering user')
    }
});

app.post('/api/login', passport.authenticate('local'), (req, res) => {
    // Redirect URL based on authentication success
    if (req.isAuthenticated()) {
        res.redirect('/')
        return res.json({status: "success"})
    } 
    if (error) {
        return res.json({Error: "Error in Server"})
    } else {
        return res.json({status: "Error", Error: "Wrong Email or Password"});
    }
    
});

app.get('/api/logout', (req, res) => {
    res.logout();
    res.send('Logged out')
})

app.get('api/user', passport.authenticate('local', {session: false}), (res, req) => {
    console.log('Requested user:', req.user);
    res.json(req.user);
})

app.use(express.static(path.join(__dirname, 'front-end/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'))
})

const port = 5001; //choose a port number

// Start the server
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
