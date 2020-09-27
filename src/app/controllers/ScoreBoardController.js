import connection from '../../database/connection';
import Logger from '../../lib/logger';

class ScoreBoardController {
  async list(req, res) {
    Logger.header('controller - scoreboard - list');

    const points = await connection('score')
      .select(
        'score.user_id',

        'users.name',
        'users.semester',
        'users.course'
      )
      .count('score.point', { as: 'points' })
      .join('users', 'users.id', 'score.user_id')
      .groupBy('score.user_id')
      .orderBy('points', 'desc');

    const ranking = points.map((row) => {
      return {
        name: row.name,
        course: row.course,
        semester: row.semester,
        points: row.points,
      };
    });

    Logger.success('[200]');
    return res.json(ranking);
  }

  async store(req, res) {
    Logger.header('controller - scoreboard - store');

    const { id } = req.params;
  }
}

export default new ScoreBoardController();
