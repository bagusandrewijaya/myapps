const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mysql = require('mysql2');
const app = express();
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // Query the database to check if the username exists
    connection.query('SELECT * FROM tbl_users WHERE username = ? and password = ?', [username,password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        // Check if the username exists in the database
        const userExists = results.length > 0;

        // Set status code based on userExists value
        const statusCode = userExists ? 200 : 401;

        // Return the result
        res.status(statusCode).json({
            message: userExists ? 'Login successful' : 'Login failed',
            username: username
        });
    });
});

app.listen(5001, () => {
    console.log(`Server is running on port`);
});
