import express from 'express';
//import User from './models/user.js';
import path from 'path';
import cors from 'cors';
import AdminJSExpress from '@adminjs/express';
import AdminJS from 'adminjs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'express-handlebars';
import session from 'express-session';
import mysql from 'mysql2';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt'; 
import { default as AdminJSAdapterSequelize } from '@adminjs/sequelize';
import { Database, Resource } from '@adminjs/typeorm' // or any other adapter
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router()

//const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve the static files
{/*app.use(express.static(path.join(__dirname, 'front-end/budgeting_tool/build')));

//  Catch-all route for React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end/budgeting_tool', 'build', 'index.html'));
});
*/}
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

// Middleware and configurations
app.use(
    session({
    secret: secretkey,
    resave: false,
    saveUninitialized: true
    })
);

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
    }); */}
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

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

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
            console.log(err)
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

app.get('/monthly-budget', (req, res) => {
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
    console.log('queried')
    con.query(sql, (err, result) => {
        if (err) return (console.log('Error fetching data', err), res.json({Error: 'Retrieval failed'}))
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
        if (err) return (console.log(err), res.json({status: 'Error', Error: 'Server Error'}))
        return res.json({status: 'success', Result: result})
    })
});

app.get('/budgetID/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM budget where id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return (console.log(err), res.json({status: 'Error', Error: 'Server Error'}))
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenseID/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM expenses where id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return (console.log(err), res.json({status: 'Error', Error: 'Server Error'}))
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenses/:month/:year', (req, res) => {
    const id = req.params.month
    const sql = "SELECT * FROM expenses where month = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return (console.log('Error fetching data', err), res.json({Error: 'Retrieval failed'}))
        return res.json({status: 'success', Result: result})
    })
});

app.put('/update-budget/:id', (req, res) => {
    const id = req.params.id
    const { name, estimated_amount } = req.body

    con.query('UPDATE budget SET name = ?, est_amount = ? WHERE id = ?', [name, estimated_amount, id], (error, results) => {
        if (error) {
            console.error(error)
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
        console.log(req.body.item_name)
        console.log(req.body.amount)
        if (err) return (console.log(err), res.json({Error: "Updating error in sql"}))
        console.log('Updated')
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

/*
app.post('add-budget', (req, res) => {
    const sql = "INSERT"
})*/

/*
app.post('/logi', (req, res) => {
    const sql = 'SELECT * FROM  user where username = ? AND password = ?';
    con.query(sql, [req.body.username, req.body.password], (error, result) => {
        if (error){
            return res.json({status: 'Error', Error: 'Error in running query'})
        }
        if (result.length > 0){
            return res.json({status: 'success'})
        } else {
            return res.json({status: 'Error', Error: 'Invalid username or password'})
        }
    })
})


app.post('/login', passport.authenticate('local'), (req, res) => {
    const sql = 'SELECT * FROM  user where username = ? AND password = ?';
    con.query(sql, [req.body.username, req.body.password], (error, result) => {
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
    
    })
    
});


app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Pass the error to the next middleware
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentiction failed'})
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ message: 'Authentication successful'});
        });
    })(req, res, next);
});
*/
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

const port = 5001; //choose a port number

// Start the server
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
