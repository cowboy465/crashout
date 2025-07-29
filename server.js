import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const forumTopics = [];
const users = [];

app.post('/api/upload', (req, res) => {
  console.log('New content upload:', req.body);
  res.status(200).send({ status: 'success', message: 'Post received' });
});

app.post('/api/forum/post', (req, res) => {
  const { topic } = req.body;
  if (topic) forumTopics.push(topic);
  res.status(200).send({ status: 'success' });
});

app.get('/api/forum/topics', (req, res) => {
  res.json({ topics: forumTopics });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) return res.status(200).send({ status: 'success' });
  return res.status(401).send({ status: 'error', message: 'Invalid credentials' });
});

app.post('/api/register', (req, res) => {
  const { newuser, newpass } = req.body;
  if (!users.find(u => u.username === newuser)) {
    users.push({ username: newuser, password: newpass });
    return res.status(200).send({ status: 'registered' });
  }
  return res.status(409).send({ status: 'error', message: 'User already exists' });
});

app.get('/stream', (req, res) => {
  res.send('Stream placeholder — plug in WebRTC or OBS to go live.');
});

app.listen(PORT, () => {
  console.log(`CrashOut backend running at http://localhost:${PORT}`);
});
