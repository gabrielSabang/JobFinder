import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'; // Assuming you have a User model

// @desc    Get users based on a search query or get all users
// @route   GET /api/users
// @access  Private (assuming only logged-in users can search)
const getUsers = asyncHandler(async (req, res) => {
  // The search keyword is extracted from the query parameter 'q'
  const keyword = req.query.q
    ? {
        // We are searching on the 'name' field of the User model.
        name: {
          $regex: req.query.q,
          $options: 'i', // 'i' for case-insensitive search
        },
      }
    : {}; // If no keyword, the filter is an empty object, returning all users.

  const users = await User.find({ ...keyword });
  res.json(users);
});

export { getUsers };