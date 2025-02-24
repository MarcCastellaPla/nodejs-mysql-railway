import express from "express";
import { pool } from "./db.js";
import { PORT } from "./config.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'pug');
app.set('views', join(__dirname, '../views'));

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get("/ping", async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT "hello world" as RESULT`);
    res.json(result[0]);
  } catch (error) {
    console.error('Error in ping:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get("/create", async (req, res) => {
  try {
    res.render("create");
  } catch (error) {
    console.error('Error rendering create page:', error);
    res.status(500).send('Error loading page');
  }
});

app.post("/create", async (req, res) => {
  try {
    const userName = req.body.userName;
    console.log('Received userName:', userName);
    
    if (!userName) {
      throw new Error('Username is required');
    }
    
    const [result] = await pool.query(
      `INSERT INTO users(name) VALUES (?)`, [userName]
    );
    console.log('Query result:', result);
    
    res.redirect('/');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user: ' + error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT);
console.log("Server on port", PORT);
