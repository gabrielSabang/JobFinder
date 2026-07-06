import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { setCache, getCache } from '../config/redis.js';
import {
  createFallbackUser,
  getFallbackUserByEmail,
  getFallbackUserById,
  getFallbackUserByUserName,
  searchFallbackUsers,
  isFallbackMode,
} from '../config/fallbackStore.js';

const maxAge = 3 * 24 * 60 * 60

const getToken = (id) => {

  const userToken = jwt.sign({ id }, process.env.JWT_SECRET)
  return userToken
}

export const getUser = async (req, res) => {
  try {
    const { userName } = req.params;

    const cacheKey = `user:${userName}`;
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
      console.log(`Cache hit for user: ${userName}`);
      return res.status(200).json({ user: cachedUser });
    }

    let user;
    if (isFallbackMode()) {
      user = await getFallbackUserByUserName(userName);
    } else {
      user = await User.findOne({ userName }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await setCache(cacheKey, user, 3600);

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error while fetching user.' });
  }
}

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    let query = {};
    if (q && q.trim() !== '') {
      query = {
        $or: [
          { userName: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      };  
    }

    let users;
    if (isFallbackMode()) {
      users = await searchFallbackUsers(q || '');
    } else {
      users = await User.find(query).select('-password').limit(q ? 10 : 50);
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ users: [], message: 'Server error while searching users.' });
  }
}

export const getMe = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    let userData;
    if (isFallbackMode()) {
      userData = await getFallbackUserById(userId);
    } else {
      userData = await User.findById(userId);
    }

    if (!userData)
      return res.status(404).json({ message: "user not found" })

    // Only send back non-sensitive user information
    const safeUserData = {
      _id: userData._id,
      userName: userData.userName,
      email: userData.email
    };

    return res.status(200).json({ user: safeUserData });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}


export const userSignUp = async (req, res) => {
  const { userName, email, password } = req.body

  if (!userName || !email || !password)
    return res.status(400).json({ message: 'All fields are required' })

  try {
    let user;
    if (isFallbackMode()) {
      user = await createFallbackUser({ userName, email, password });
    } else {
      user = await User.create({
        userName,
        email,
        password
      });
    }

    const token = getToken(user._id)

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    return res.status(201).json({ message: 'User created successfully', user: user._id || user.id })

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
  const normalizedEmail = (email || '').toLowerCase().trim();

  if (!normalizedEmail || !password)
    return res.status(400).json({ message: 'All fields are required' })

  try {
    let user;
    if (isFallbackMode()) {
      const fallbackUser = await getFallbackUserByEmail(normalizedEmail);
      console.log('fallback login request', { mode: isFallbackMode(), email: normalizedEmail, found: !!fallbackUser });
      if (!fallbackUser) {
        throw new Error('Invalid email');
      }
      const isMatch = await bcrypt.compare(password, fallbackUser.password);
      console.log('fallback password match', isMatch);
      if (!isMatch) {
        throw new Error('Invalid password');
      }
      user = fallbackUser;
    } else {
      user = await User.login(normalizedEmail, password)
    }

    const token = getToken(user._id)

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

    const safeUserData = {
      _id: user._id,
      userName: user.userName,
      email: user.email
    };

    return res.status(200).json({ message: 'User logged in successfully', user: safeUserData })

  } catch (error) {
    console.error('Error during user login:', error.message);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
}

export const userLogout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 })
    return res.status(200).json({ message: "User logged out successfully" })
  } catch {
    return res.status(500).json({ message: "Could not log out user: Server Error" })
  }
}
