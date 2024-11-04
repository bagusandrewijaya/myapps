const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, child } = require('firebase/database');
const { v4: uuidv4 } = require('uuid');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

require('dotenv').config();

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxHewvHY8332f-DmSnuZ4SPjoEM1-HaXQ",
    authDomain: "webtools-9a679.firebaseapp.com", 
    databaseURL: "https://webtools-9a679-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "webtools-9a679",
    storageBucket: "webtools-9a679.appspot.com",
    messagingSenderId: "887212198058",
    appId: "1:887212198058:web:258fd52dd16f89c74468d3",
    measurementId: "G-BT9XFBQG0E"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

// CRUD Mahasiswa endpoints

// Create new mahasiswa
app.post('/mahasiswa', async (req, res) => {
    try {
        const mahasiswa = req.body;
        const id = uuidv4(); // Generate UUID v4 for mahasiswa
        mahasiswa.id = id; // Add UUID to mahasiswa object
        const mahasiswaRef = ref(db, 'mahasiswa/' + id);
        await set(mahasiswaRef, mahasiswa);
        res.status(201).json({ message: 'Mahasiswa created successfully', mahasiswa });
    } catch (error) {
        console.error('Error creating mahasiswa:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all mahasiswa
app.get('/mahasiswa', async (req, res) => {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'mahasiswa'));
        if (snapshot.exists()) {
            const mahasiswa = snapshot.val();
            const mahasiswaArray = Object.values(mahasiswa).map(mhs => mhs);
            res.status(200).json({
                metadata: {
                    status: "ok",
                    code: 200
                },
                data: mahasiswaArray
            });
        } else {
            res.status(404).json({
                metadata: {
                    status: "error", 
                    code: 404
                },
                data: []
            });
        }
    } catch (error) {
        console.error('Error fetching mahasiswa:', error);
        res.status(500).json({
            metadata: {
                status: "error",
                code: 500
            },
            data: []
        });
    }
});

// Delete mahasiswa by ID
app.delete('/mahasiswa/:id', async (req, res) => {
    try {
        const mahasiswaId = req.params.id;
        const mahasiswaRef = ref(db, `mahasiswa/${mahasiswaId}`);
        
        // Check if mahasiswa exists
        const snapshot = await get(mahasiswaRef);
        if (!snapshot.exists()) {
            return res.status(404).json({
                metadata: {
                    status: "error",
                    code: 404,
                    message: "Mahasiswa not found"
                }
            });
        }

        // Delete the mahasiswa
        await set(mahasiswaRef, null);
        
        res.status(200).json({
            metadata: {
                status: "ok",
                code: 200,
                message: "Mahasiswa deleted successfully"
            }
        });
    } catch (error) {
        console.error('Error deleting mahasiswa:', error);
        res.status(500).json({
            metadata: {
                status: "error",
                code: 500,
                message: "Internal server error"
            }
        });
    }
});

// Get mahasiswa by ID
app.get('/mahasiswa/:id', async (req, res) => {
    try {
        const mahasiswaId = req.params.id;
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `mahasiswa/${mahasiswaId}`));
        if (snapshot.exists()) {
            res.status(200).json(snapshot.val());
        } else {
            res.status(404).json({ message: 'Mahasiswa not found' });
        }
    } catch (error) {
        console.error('Error fetching mahasiswa:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.listen(5050, () => {
    console.log(`Server is running on port 5050`);
});
