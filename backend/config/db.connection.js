import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const userName = process.env.DB_username
const password = process.env.DB_password
export const db_connection = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.wg7qwp6.mongodb.net/?appName=Cluster0`)
  } catch (error) {
    console.log('Database connection failed', error)
    throw error
  }
}