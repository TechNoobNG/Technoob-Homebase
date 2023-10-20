const leaderboard = require("../models/leader_board");

module.exports = {
    async getAll() {
        try {
            const leaderboard_Ranking = await leaderboard.find({})
              .sort({ score: -1 }) 
              .exec();
        
            return leaderboard_Ranking;
          } catch (error) {
            throw error;
          }
    },
    async getUser(userId) {
      try {
        let rank
        let total
        const sortedLeaderboard = await leaderboard.find().sort({ score: -1 });
        const record = sortedLeaderboard.find(entry => entry.userId.toString() === userId.toString());
        if (record) {
          rank = sortedLeaderboard.findIndex(entry => entry.userId.toString() === userId.toString()) + 1;
          total = sortedLeaderboard.length
        }
            return { record, rank, total  };
          } catch (error) {
            throw error;
          }
    }
}