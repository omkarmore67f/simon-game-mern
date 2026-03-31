const User = require('../models/User.model');

/**
 * @route   GET /api/user/profile
 * @desc    Get the logged-in user's full profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

/**
 * @route   PUT /api/user/profile
 * @desc    Update user's name
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated.', user: user.toPublicJSON() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

module.exports = { getProfile, updateProfile };
