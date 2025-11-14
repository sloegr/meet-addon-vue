import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

// Middleware to enable CORS and parse JSON bodies
app.use(cors())
app.use(express.json())

// API endpoint to handle the 'join' request
app.post('/api/join', (req, res) => {
  const { clientCode, meetingCode } = req.body

  console.log('Received data on server:')
  console.log({ clientCode, meetingCode })

  // You can add your logic here to process the data

  res.status(200).json({ message: 'API received!' })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
