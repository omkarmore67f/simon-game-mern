const User = require('../models/User.model');

/**
 * @route   GET /api/leaderboard
 * @desc    Get top 20 players sorted by high score
 * @access  Private
 */
const getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await User.find({ highScore: { $gt: 0 } })
      .select('name highScore gamesPlayed totalScore createdAt')
      .sort({ highScore: -1 })
      .limit(20)
      .lean(); // Use lean() for read-only queries (faster)

    // Add rank to each player
    const leaderboard = topPlayers.map((player, index) => ({
      rank: index + 1,
      ...player,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
};

module.exports = { getLeaderboard };
