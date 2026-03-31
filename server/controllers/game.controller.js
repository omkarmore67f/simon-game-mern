const User = require('../models/User.model');

/**
 * @route   POST /api/game/score
 * @desc    Submit a game score; update high score if beaten
 * @access  Private
 */
const submitScore = async (req, res) => {
  try {
    const { score, level, difficulty } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isNewHighScore = score > user.highScore;

    // Update stats
    user.gamesPlayed += 1;
    user.totalScore += score;
    if (isNewHighScore) {
      user.highScore = score;
    }

    // Append to game history (keep only last 20 entries)
    user.gameHistory.push({ score, level, difficulty });
    if (user.gameHistory.length > 20) {
      user.gameHistory = user.gameHistory.slice(-20);
    }

    await user.save();

    res.json({
      success: true,
      message: isNewHighScore ? '🎉 New high score!' : 'Score submitted!',
      isNewHighScore,
      highScore: user.highScore,
      gamesPlayed: user.gamesPlayed,
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit score.' });
  }
};

/**
 * @route   GET /api/game/history
 * @desc    Get current user's game history
 * @access  Private
 */
const getGameHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('gameHistory');
    const history = [...(user.gameHistory || [])].reverse(); // Most recent first
    res.json({ success: true, history });
  } catch (error) {
    console.error('Game history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch game history.' });
  }
};

module.exports = { submitScore, getGameHistory };
