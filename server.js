import express from 'express';
import path from 'path';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mysql from 'mysql2';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
import MySQLStore from 'express-mysql-session'

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    //port: process.env.PORT
})

con.connect(err => {
    if (err){
        console.log("Error connecting to the database", err)
    } else {
        console.log("Database connected")
    }
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (adjust as needed)
const sessionStore = new (MySQLStore(session))({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
}, con)


// Set up session
app.use(session({ secret: process.env.SECRET, resave: true, saveUninitialized: true, store: sessionStore}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session())


app.use(cors())

passport.use(new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'https://amused-beanie-duck.cyclic.app/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        const {id, displayName, emails} = profile;
        const email = emails[0].value

        con.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
            if (err) {
                return done(null, err)
            } else {
                if (result.length > 0) {
                    const user = {
                        name: result[0].name,
                        email: result[0].email
                    }
                    return done(null, user)
                }
                else {
                    const user = {
                        google_id: id,
                        name: displayName,
                        email: emails[0].value,
                    } 

                    con.query('INSERT INTO user SET ?', user, (err, result) => {
                        if (err) {
                            return done(err, null)
                        }
                        user.id = result.insertId
                        return done(null, user)
                    })
                }
            }
        })   
      }
    )
);
  
  
      
// Serialize and deserialize user functions
passport.serializeUser((user, done) => {
    done(null, user.email);
  });
  
passport.deserializeUser((email, done) => {
    con.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
        if (err) {
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
        const token = jwt.sign({ userId: req.user.id }, process.env.JWTSECRET, {
            expiresIn: '1h', // Token expiration time (adjust as needed)
    });
    res.redirect(`/?token=${token}`);
    }
);

// Check authentication status route
app.get('/api/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
      // If the user is authenticated, send user information and a JWT token
      const token = jwt.sign({ userId: req.user.id }, process.env.JWTSECRET, {
        expiresIn: '1h', // Token expiration time (adjust as needed)
      });
      res.json({ isAuthenticated: true, user: req.user, token });
    } else {
      // If not authenticated, send appropriate response
      res.json({ isAuthenticated: false });
    }
});
  

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/sign-in')
    });
});


// Generate a secret key
const secretkey = crypto.randomBytes(64).toString('hex');


app.post('/create-budget', (req, res) => {

    const { user, year, month, currency } = req.body;

    const checkIfExistQuery = 'SELECT * FROM monthlybudget WHERE user = ? AND month = ? AND year = ?';
    con.query(checkIfExistQuery, [user, month, year], (error, results) => {
        if (error) {
            //throw error;
            return res.json({status: 'Query error'})
        }

        if (results.length > 0) {
            // Month and Year combination already exists, send an error response
            return res.json({status: "error"})
        } else {
            // if not exists, perform the insertion
            const insertQuery = "INSERT INTO monthlybudget (user, year, month, currency) VALUES (?, ?, ?, ?)"
            con.query(insertQuery, [ user, year, month, currency ], (insertError, insertResults) => {
                if (insertError) {
                    //throw insertError;
                    return res.json({status: 'error'})
                } else {
                    return res.json({status: "success", message: month + ' ' + year + ' ' + 'budget started'})
                }
            })
        }
    })
});

app.post('/add-budget', (req, res) => {
    const sql = "INSERT INTO budget (`user`, `name`, `currency`, `est_amount`, `month`, `year`) VALUES (?)";
    const values = [
        req.body.user,
        req.body.name,
        req.body.symbol,
        req.body.estimated_amount,
        req.body.budget_month,
        req.body.year,
    ]
    con.query(sql, [values], (err, result) => {
        if (err) {
            return res.json({status: 'error'})
        }
        return res.json({status: 'success'})
    })
})

app.post('/add-expenses', (req, res) => {
    const sql = "INSERT INTO expenses (`user`, `item_name`,  `currency`, `amount`, `month`, `year`) VALUES (?)";
    const values = [
        req.body.user,
        req.body.name,
        req.body.symbol,
        req.body.amount,
        req.body.expenses_month,
        req.body.year,
    ]
    console.log(values)
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({status: 'error'})
        return res.json({status: 'success'})
    })
})

app.get('/monthly-budgets', (req, res) => {
    const userId = req.user.email
    const sql = "SELECT * FROM monthlybudget WHERE user = ? ORDER BY year DESC, FIELD(month, 'December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January')" // ORDER BY year DESC, CASE WHEN month = 'December', THEN 1 WHEN month = 'November' THEN 2 WHEN month = 'october' THEN 3 WHEN month = 'september' THEN 4 WHEN month = 'August' THEN 5 WHEN month = 'July' THEN 6 WHEN month = 'october'
    con.query(sql, [userId], (err, result) => {
        if (err) return res.json({Error: 'Retrieval failed'})
        return res.json({status: 'success', Result: result})
    })
});

app.get('/budget', (req, res) => {
    const userId = req.user.email
    const sql = "SELECT * FROM budget WHERE user = ? ORDER BY year, month DESC"
    con.query(sql, [userId], (err, result) => {
        if (err) return (console.log('Error fetching data', err), res.json({status: 'failed'}))
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenses', (req, res) => {
    const userId = req.user.email
    const sql = "SELECT * FROM expenses where user = ? ORDER BY year, month DESC"
    con.query(sql, [userId], (err, result) => {
        if (err) return res.json({status: 'failed'})
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
    const userId = req.user.email
    const {month, year} = req.params;
    const sql = "SELECT * FROM budget where user = ? AND month = ? AND year = ?"
    con.query(sql, [userId, month, year], (err, result) => {
        if (err) return res.json({status: 'Error', Error: 'Server Error'})
        return res.json({status: 'success', Result: result})
    })
});

app.get('/budgetID/:id', (req, res) => {
    const userId = req.user.email
    const id = req.params.id
    const sql = "SELECT * FROM budget where user = ? AND id = ?"
    con.query(sql, [userId, id], (err, result) => {
        if (err) return res.json({status: 'Error', Error: 'Server Error'})
        if (result.length === 0) {
            return res.json({status: 'null'})
        }
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenseID/:id', (req, res) => {
    const userId = req.user.email
    const id = req.params.id
    const sql = "SELECT * FROM expenses where user = ? AND id = ?"
    con.query(sql, [userId, id], (err, result) => {
        if (err) return res.json({status: 'Error', Error: 'Server Error'})
        if (result.length === 0) {
            return res.json({status: 'null'})
        }
        return res.json({status: 'success', Result: result})
    })
});

app.get('/expenses/:month/:year', (req, res) => {
    const userId = req.user.email
    const {month, year} = req.params;
    const sql = "SELECT * FROM expenses where user = ? AND month = ? AND year = ?"
    con.query(sql, [userId, month, year], (err, result) => {
        if (err) return res.json({Error: 'Retrieval failed'})
        return res.json({status: 'success', Result: result})
    })
});

app.put('/update-budget/:id', (req, res) => {
    const userId = req.user.email
    const id = req.params.id
    const { name, estimated_amount } = req.body

    con.query('UPDATE budget SET name = ?, est_amount = ? WHERE user = ? AND id = ?', [name, estimated_amount, userId, id], (error, results) => {
        if (error) {
            return res.json({status: "error"})
        } else {
            return res.json({status: "success"})
        }
    })
});

app.put('/update-expense/:id', (req, res) => {
    const userId = req.user.email
    const id = req.params.id
    const sql = "UPDATE `expenses` SET `item_name`= ?,`amount`=? WHERE user = ? AND id = ?"
    con.query(sql, [req.body.item_name, req.body.amount, userId, id], (err, result) => {
        if (err) return res.json({Error: "Updating error in sql"})
        return res.json({status: "success"})
    })
});

app.delete('/budget-delete/:id', (req, res) => {
    const userId = req.user.email
    const id = req.params.id
    const sql = "DELETE FROM budget WHERE user = ? AND id = ?";
    con.query(sql, [userId, id], (err, result) => {
        if (err) return res.json({Error: "Delete budget error in sql"})
        return res.json({status: "success"})
    })
});

app.delete('/expense-delete/:id', (req, res) => {
    const userId = req.user.email
    const id = req.params.id
    const sql = "DELETE FROM expenses WHERE userId AND id = ?";
    con.query(sql, [userId, id], (err, result) => {
        if (err) return res.json({Error: "Delete expenses error in sql"})
        return res.json({status: "success"})
    })
});


// Define the root directory for static files based on the environment 
console.log('DIR NAME:', __dirname)
app.use(express.static(path.join(__dirname, 'front-end/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'))
})

{/*

app.get('*', function (req, res) {
    res.sendFile(
        path.join(staticFilesRoot, 'index.html'),
        function (err) {
            res.status(500).send(err)
        }
    )
})

*/}

const port = 5001; //choose a port number

// Start the server
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
