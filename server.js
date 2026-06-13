import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'smartclinic'
});

db.connect((err) => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("MySQL Connected");
    }
});

// LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE email=? AND password=?';
    db.query(sql, [email, password], (err, result) => {
        if (err) { console.log(err); return res.status(500).send("Server error"); }
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.status(401).send("Invalid credentials");
        }
    });
});

// SIGNUP
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const checkSql = 'SELECT * FROM Users WHERE email=?';
    db.query(checkSql, [email], (err, result) => {
        if (err) { return res.status(500).send("Server error"); }
        if (result.length > 0) {
            return res.status(400).send("Email already exists");
        }
        const sql = 'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, "patient")';
        db.query(sql, [name, email, password], (err2, result2) => {
            if (err2) { return res.status(500).send("Signup failed"); }
            const newUser = { user_id: result2.insertId, name, email, role: 'patient' };
            res.send(newUser);
        });
    });
});

// GET DOCTORS
app.get('/doctors', (req, res) => {
    const sql = 'SELECT * FROM Doctors';
    db.query(sql, (err, result) => {
        if (err) { console.log(err); return res.status(500).send(err); }
        res.send(result);
    });
});

// BOOK APPOINTMENT
app.post('/book-appointment', (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    
    const checkPatient = 'SELECT * FROM Patients WHERE patient_id=?';
    db.query(checkPatient, [patient_id], (err, result) => {
        if (result && result.length === 0) {
            const insertPatient = 'INSERT IGNORE INTO Patients (patient_id, age, gender) VALUES (?, 25, "Unknown")';
            db.query(insertPatient, [patient_id]);
        }
    });

    const sql = `INSERT INTO Appointments (patient_id, doctor_id, appointment_date, status) VALUES (?, ?, ?, 'booked')`;
    db.query(sql, [patient_id, doctor_id, appointment_date], (err, result) => {
        if (err) { 
            console.log(err);
            return res.status(500).send(err.message);
        }
        res.send("Appointment Booked");
    });
});

// GET APPOINTMENTS BY PATIENT
app.get('/appointments/:patientId', (req, res) => {
    const patientId = req.params.patientId;
    const sql = `
        SELECT 
            a.*,
            u.name AS doctorName,
            d.specialization AS specialty
        FROM Appointments a
        JOIN Doctors d ON a.doctor_id = d.doctor_id
        JOIN Users u ON d.doctor_id = u.user_id
        WHERE a.patient_id = ?
    `;
    db.query(sql, [patientId], (err, result) => {
        if (err) { console.log(err); return res.status(500).send(err); }
        res.send(result);
    });
});

app.listen(5000, () => {
    console.log("Server Running On Port 5000");
});