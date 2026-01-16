import User from '../models/User.js'
import jwt from 'jsonwebtoken'


const maxAge = 3 * 24 * 60 * 60

const getToken = (id) => {

  const userToken = jwt.sign({ id }, process.env.JWT_SECRET)
  return userToken
}

export const getUser = async (req, res) => {
  try {
      const { userName } = req.params;
      const user = await User.findOne({ userName }).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Server error while fetching user.' });
    }
}

export const getMe = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json({ user });
};


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
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    return res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
}

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required' })

  try {
    const user = await User.login(email, password)

    const token = getToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

    return res.status(200).json({ message: 'User logged in successfully', user: user._id })

  } catch (error) {
    console.error('Error during user login:', error.message);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
}

export const userLogout = (req, res) => {
  const userCookie = req.cookies['jwt']
  
  if(!userCookie)
    return res.status(400).json({message: 'User is already logged out'})

  try {
    res.cookie('jwt', '', {maxAge: 1})
    return res.status(200).json({message: "User logged out successfully"})
  } catch (error) {
    return res.status(500).json({message: "Could not log out user: Server Error"})
  }
}
