// cd "C:\Users\mark paolo\Documents\Vs Code File"

const express = require('express'); 
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Pool } = require('pg');
const fs = require('fs');
const app = express();
const port = 3000;
const XLSX = require('xlsx');


// Initialize the PostgreSQL pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'TestDB',
    password: '031404',
    port: 5432,
});

// Connect to the database
pool.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Connection error', err.stack);
  });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Example of querying the database directly
pool.query('SELECT * FROM user_subjects', (err, res) => {
    if (err) {
      console.error('Query error', err);
      return;
    }
    console.log(res.rows);  // Logs the rows from the user_subjects table
  });
  

// Define your routes here
app.get('/some-route', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.params.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Close the database connection when the server exits
process.on('exit', () => {
  pool.end();
});

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // BAG'o LAINNNNNN
}));

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/image', express.static(path.join(__dirname, 'image')));

// Routes for serving HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/createclass', (req, res) => {
    res.sendFile(path.join(__dirname, 'createclass.html'));
});

app.get('/manageclass', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'manageclass.html'));
});

app.get('/addstudent', (reg, res) => {
    res.sendFile(path.join(__dirname, 'addstudent.html'))
});

app.get('/attendance', (reg, res) => {
    res.sendFile(path.join(__dirname, 'attendance.html'))
});

app.get('/studentlist', (reg, res) => {
    res.sendFile(path.join(__dirname, 'studentlist.html'));
});

app.get('/recorded', (reg, res) => {
    res.sendFile(path.join(__dirname, 'recorded.html'));
});

// Register user
app.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING id', [username, hashedPassword]);
        res.send('Registration successful, you can now log in');
    } catch (error) {
        console.error(error);
        res.send('Error registering user');
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.send('Invalid username or password');
        }

        req.session.userId = user.id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.send('Error logging in');
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if session is missing
    }
    res.send('Welcome to your dashboard!');
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.send('Error logging out');
        }
        res.redirect('/login');
    });
});

app.get('/api/dashboard-stats', async (req, res) => {
    if (!req.session.userId) {
        return res.status(403).json({ error: 'Unauthorized' }); // Ensure user is logged in
    }

    try {
        const userId = req.session.userId;

        // Modify the queries to filter data based on the logged-in user's ID
        const studentCountQuery = `
            SELECT COUNT(*) AS count 
            FROM public.user_students 
            WHERE user_id = $1`;
        const subjectCountQuery = `
            SELECT COUNT(*) AS count 
            FROM public.user_subjects 
            WHERE user_id = $1`;

        const studentResult = await pool.query(studentCountQuery, [userId]);
        const subjectResult = await pool.query(subjectCountQuery, [userId]);

        res.json({
            students: studentResult.rows[0].count,
            subjects: subjectResult.rows[0].count,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/addsubject', async (req, res) => {
    const { subjectCode, subjectName, section } = req.body;

    // Assuming you have a session or user ID to identify the user
    const userId = req.session.userId;  // Example: You would store the user ID in the session during login

    if (!subjectCode || !subjectName || !section || !userId) {
        return res.status(400).send('Missing required fields');
    }

    try {
       
        await pool.query(
            'INSERT INTO user_subjects (user_id, subject_code, subject_name, section) VALUES ($1, $2, $3, $4)',
            [userId, subjectCode, subjectName, section]
        );
        res.send('Subject added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding subject');
    }
});

// Get subjects for the logged-in user
app.get('/getsubjects', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).send('Unauthorized');
    }

    try {
        const result = await pool.query(
            'SELECT id, subject_code, subject_name, section FROM user_subjects WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.json([]); // Return an empty array if no subjects are found
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving subjects:', error);
        res.status(500).send('Error retrieving subjects');
    }
});

// Route to get the subject name based on the subject code
app.get('/getsubjectname', async (req, res) => {
    const { subjectCode } = req.query;
    
    if (!subjectCode) {
        return res.status(400).json({ error: 'Subject code is required' });
    }

    try {
        const result = await pool.query('SELECT subject_name FROM subjects WHERE subject_code = $1', [subjectCode]);
        
        if (result.rows.length > 0) {
            res.json({ subjectName: result.rows[0].subject_name });
        } else {
            res.status(404).json({ error: 'Subject code not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/deletesubject/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId; // Ensure only logged-in user can delete their subjects

    try {
        const result = await pool.query(
            'DELETE FROM user_subjects WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (result.rowCount > 0) {
            res.status(200).send('Subject deleted');
        } else {
            res.status(404).send('Subject not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting subject');
    }
});


app.post('/addstudent', async (req, res) => {
    const { studentNumber, firstName, middleInitial, lastName, subjectId } = req.body;
    const userId = req.session.userId; // Get the logged-in user's ID

    // Validate that all fields are provided
    if (!studentNumber || !firstName || !middleInitial || !lastName || !subjectId) {
        return res.status(400).send('Missing required fields');
    }

    // Generate full name on the backend
    const fullName = `${firstName} ${middleInitial}. ${lastName}`;

    try {
        // Insert into the database with separate first name, middle initial, and last name fields
        await pool.query(
            'INSERT INTO user_students (user_id, student_number, first_name, middle_initial, last_name, full_name, class) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [userId, studentNumber, firstName, middleInitial, lastName, fullName, subjectId]
        );

        res.status(200).send('Student added successfully');
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).send('Error adding student');
    }
});

app.get('/getstudents', async (req, res) => {
    const { classId } = req.query;
    const userId = req.session.userId;

    if (!userId || !classId) {
        return res.status(403).send('Unauthorized or missing class ID');
    }

    try {
        const result = await pool.query(
            `
            SELECT us.student_number, us.full_name, s.section
            FROM user_students us
            JOIN user_subjects s ON us.class = s.id
            WHERE us.user_id = $1 AND us.class = $2
            ORDER BY SPLIT_PART(us.full_name, ' ', array_length(string_to_array(us.full_name, ' '), 1)) -- Sort by the last name
            `,
            [userId, classId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});

app.delete('/deletestudent/:studentNumber', async (req, res) => {
    const { studentNumber } = req.params;
    const userId = req.session.userId; // Ensure the student belongs to the logged-in user

    if (!userId) {
        return res.status(403).send('Unauthorized');
    }

    try {
        // Start a transaction to ensure both student and their attendance records are deleted
        await pool.query('BEGIN');

        // Delete the student from the user_students table
        const deleteStudentQuery = 'DELETE FROM user_students WHERE student_number = $1 AND user_id = $2';
        const result = await pool.query(deleteStudentQuery, [studentNumber, userId]);

        if (result.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send('Student not found');
        }

        // Delete the student’s attendance records
        const deleteAttendanceQuery = 'DELETE FROM attendance_records WHERE student_number = $1 AND user_id = $2';
        await pool.query(deleteAttendanceQuery, [studentNumber, userId]);

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(200).send('Student and attendance records deleted successfully');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error deleting student and attendance records:', error);
        res.status(500).send('Error deleting student and attendance records');
    }
});

app.post('/api/attendance', async (req, res) => {
    const userId = req.session.userId;
    const attendanceRecords = req.body;

    if (!userId) {
        return res.status(403).send('Unauthorized');
    }

    try {
        // Insert attendance records into the database
        const query = `
            INSERT INTO attendance_records (class, section, student_number, full_name, attendance_date, status, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        
        const promises = attendanceRecords.map(record => {
            return pool.query(query, [
                record.class,
                record.section,
                record.student_number,
                record.full_name,
                record.attendance_date,
                record.status,
                userId
            ]);
        });

        await Promise.all(promises); // Execute all the insert queries
        res.status(200).send('Attendance saved successfully!');
    } catch (error) {
        console.error('Error saving attendance:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/attendance', async (req, res) => {
    const { className } = req.query;
    const userId = req.session.userId;

    if (!userId || !className) {
        return res.status(403).send('Unauthorized or missing class name');
    }

    try {
        const result = await pool.query(
            `SELECT student_number, full_name, section, attendance_date, status 
             FROM attendance_records 
             WHERE class = $1 AND user_id = $2
             ORDER BY attendance_date DESC`,
            [className, userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).send('Error fetching attendance records');
    }
});

app.get('/api/subjects', async (req, res) => {
    const userId = req.session.userId; // Fetch subjects for the logged-in user
    if (!userId) {
        return res.status(403).send('Unauthorized');
    }

    try {
        const result = await pool.query(
            'SELECT id, subject_name, section FROM user_subjects WHERE user_id = $1 ORDER BY subject_name',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Internal Server Error');
    }
});

// New API for fetching students of a specific subject
app.get('/api/subjects/:subjectId/students', async (req, res) => {
    const { subjectId } = req.params;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).send('Unauthorized');
    }

    try {
        // Get subject information, including section name
        const subjectQuery = `
            SELECT subject_name, section
            FROM user_subjects
            WHERE id = $1 AND user_id = $2
        `;
        const subjectResult = await pool.query(subjectQuery, [subjectId, userId]);

        if (subjectResult.rows.length === 0) {
            return res.status(404).send('Subject not found');
        }

        const subject = subjectResult.rows[0];

        // Get students in the subject and sort them alphabetically by last name
        const studentsQuery = `
            SELECT us.student_number, us.full_name, $1 AS section
            FROM user_students us
            WHERE us.class = $2 AND us.user_id = $3
            ORDER BY SPLIT_PART(us.full_name, ' ', array_length(string_to_array(us.full_name, ' '), 1)) ASC
        `;
        const studentsResult = await pool.query(studentsQuery, [subject.section, subjectId, userId]);

        res.json({
            subjectName: subject.subject_name,
            data: studentsResult.rows,
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});
