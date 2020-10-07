const connection = require('../../database/connection');
const Logger = require('../../lib/logger');

class ChallengeController {
  async list(req, res) {
    Logger.header('controller - challenge - list');

    const challengeExist = await connection('challenges').select(
      'challenges.*'
    );

    if (challengeExist.length === 0) {
      Logger.error('No challenges in database.');
      return res.status(400).json({ error: 'No challenges in database' });
    }

    const challenges = challengeExist.map((challenge) => {
      return {
        id: challenge.id,
        description: challenge.description,
        level: challenge.level,
      };
    });

    Logger.success('[200]');
    return res.json(challenges);
  }
}

module.exports = new ChallengeController();
