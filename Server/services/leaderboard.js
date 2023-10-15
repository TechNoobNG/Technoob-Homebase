const leaderboard = require("../models/leader_board");

module.exports = {
    async getAll() {
        try {
            const leaderboard_Ranking = await leaderboard.find({})
              .sort({ score: -1 }) 
              .exec();
        
            return leaderboard_Ranking;
          } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
          }
    },
    async getUser(userId) {
        try {
            const sortedLeaderboard = await leaderboard.find().sort({ score: -1 });
            const record = sortedLeaderboard.find(entry => entry.userId.toString() === userId.toString());
            if (!record) {
            throw new Error('Record not found');
            }
            const rank = sortedLeaderboard.findIndex(entry => entry.userId.toString() === userId.toString()) + 1;
            const total = sortedLeaderboard.length
            return { record, rank, total  };
          } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
          }
    }
}