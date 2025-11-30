const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const DB_PATH = path.join(__dirname, 'db.json')

let data = []
try {
  if (fs.existsSync(DB_PATH)) {
    const raw = fs.readFileSync(DB_PATH, 'utf8')
    data = JSON.parse(raw || '[]')
  }
} catch (err) {
  console.error('Failed to read DB file', err)
  data = []
}

app.get('/people', (req, res) => {
  res.json(data)
})

app.post('/people', (req, res) => {
  const { name, height, weight } = req.body || {}
  if (!name || height === undefined || weight === undefined) {
    return res.status(400).json({ error: 'name, height and weight are required' })
  }

  const item = {
    id: Date.now(),
    name: String(name),
    height: Number(height),
    weight: Number(weight),
    createdAt: new Date().toISOString(),
  }

  data.push(item)

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed to write DB file', err)
    return res.status(500).json({ error: 'failed to persist data' })
  }

  res.status(201).json(item)
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
