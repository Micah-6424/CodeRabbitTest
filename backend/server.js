const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const csvFile = path.join(__dirname, 'messages.csv');

app.use(cors());
app.use(express.json());

function escapeCsv(value) {
  return '"' + value.replace(/"/g, '""') + '"';
}

function readMessages() {
  if (!fs.existsSync(csvFile)) return [];
  const data = fs.readFileSync(csvFile, 'utf8');
  return data
    .split('\n')
    .filter(Boolean)
    .map(line => {
      // Split CSV line, handling quoted commas
      const match = line.match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]+))/g);
      if (!match || match.length < 4) return null;
      const [id, username, content, created_at] = match.map(s => s.replace(/^"|"$/g, '').replace(/""/g, '"'));
      return { id: Number(id), username, content, created_at };
    })
    .filter(Boolean);
}

function writeMessage(message) {
  const line = `${message.id},${escapeCsv(message.username)},${escapeCsv(message.content)},${message.created_at}\n`;
  fs.appendFileSync(csvFile, line);
}

app.get('/messages', (req, res) => {
  try {
    const messages = readMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/messages', (req, res) => {
  const { username, content } = req.body;
  if (typeof username !== 'string' || typeof content !== 'string') {
    return res.status(400).json({ error: 'Username and content must be strings' });
  }
  const sanitizedUsername = username.trim().substring(0, 50);
  const sanitizedContent = content.trim().substring(0, 500);
  if (!sanitizedUsername || !sanitizedContent) {
    return res.status(400).json({ error: 'Username and content are required' });
  }
  try {
    const messages = readMessages();
    const id = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const created_at = new Date().toISOString();
    const message = { id, username: sanitizedUsername, content: sanitizedContent, created_at };
    writeMessage(message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 