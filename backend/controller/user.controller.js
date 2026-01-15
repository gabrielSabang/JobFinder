import User from '../models/User.js'
import jwt from 'jsonwebtoken'


const maxAge = 3 * 24 * 60 * 60

const getToken = (id) => {

  const userToken = jwt.sign({ id }, process.env.JWT_SECRET)
  return userToken
}

export const userSignUp = async (req, res) => {
  const { userName, email, password } = req.body

  if (!userName || !email || !password)
    return res.status(400).json({ message: 'All fields are required' })

  try {
    const user = await User.create({
      userName,
      email,
      password
    })
    const token = getToken(user._id)

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    return res.status(201).json({ message: 'User created successfully', user: user._id })

  } catch (error) {
    console.error('Error during user sign up:', error);
    // Mongoose duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    return res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
}

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).json({ message: 'All fields are required' })

  try {
    const user = await User.login({ email, password })

    const token = getToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

    return res.status(200).json({ message: 'User logged in successfully', user: user._id })

  } catch (error) {
    console.error('Error during user login:', error.message);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
}
