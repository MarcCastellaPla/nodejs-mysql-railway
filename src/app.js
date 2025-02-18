import express from "express";
import { pool } from "./db.js";
import { PORT } from "./config.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// View engine setup
app.set('view engine', 'pug');
app.set('views', join(__dirname, '../views'));

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

app.get("/ping", async (req, res) => {
  const [result] = await pool.query(`SELECT "hello world" as RESULT`);
  res.json(result[0]);
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO users(name) VALUES (?)', [name]);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

app.listen(PORT);
console.log("Server on port", PORT);
