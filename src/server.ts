import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API running' })
})

app.use('/auth', authRoutes)
app.use('/applications',applicationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: any, req: express.Request,
         res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  })
})

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})