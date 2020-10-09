// import * as Yup from 'yup';
const connection = require('../../database/connection');
const Logger = require('../../lib/logger');

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

  async listOne(req, res) {
    Logger.header('controller - scoreboard - list one');
    Logger.header(`[${req.userId}]`);

    const rows = await connection('users')
      .select('users.*', 'score.point')
      .leftJoin('score', 'users.id', 'score.user_id')
      .where('users.id', '=', req.userId);

    let points = 0;
    for (let row of rows) {
      row.point === 1 ? points++ : '';
    }

    const userPoints = {
      id: rows[0].id,
      studentId: rows[0].studentId,
      semester: rows[0].semester,
      course: rows[0].course,
      name: rows[0].name,
      email: rows[0].email,
      points,
    };
    console.log(userPoints);
    Logger.success('[200]');
    return res.json(userPoints);
  }

  async answer(req, res) {
    const { id } = req.params;
    const { answer } = req.body;
    Logger.header('controller - scoreboard - answer');
    Logger.header(`[${id}][${answer}]`);

    /**
     * Verifies if the question has been answered already by that user
     */
    const [answeredQuestion] = await connection('score')
      .select('score.*')
      .where({ 'score.user_id': req.userId, 'score.challenge_id': id });

    if (answeredQuestion) {
      Logger.error('Question already anwered');
      return res.status(400).json({ error: 'Question already answered' });
    }

    /**
     * Verifies if the answer is correct
     */
    const [rightAnswer] = await connection('challenges')
      .select('challenges.*')
      .where('challenges.id', '=', id);

    const insert = {
      user_id: req.userId,
      challenge_id: id,
      point: answer === rightAnswer.answer ? 1 : 0,
      answer,
    };

    const insertedAnswer = await connection('score').insert(insert);

    return res.json(insert);
  }

  async listPoints(req, res) {
    Logger.log('api - score - list points');
    Logger.header(`[${req.userId}]`);

    const userPoints = await connection('score')
      .select('score.*')
      .where({ 'score.user_id': req.userId })
      .orderBy('score.challenge_id', 'asc');

    if (userPoints.length === 0) {
      Logger.error('empty list');
      return res.status(401).json({ error: 'Empty list' });
    }

    const myScore = userPoints.map((challenge) => {
      let level =
        challenge.challenge_id <= 10 ? 1 : challenge.challenge_id <= 20 ? 2 : 3;
      return {
        user_id: challenge.user_id,
        challenge_id: challenge.challenge_id,
        point: challenge.point,
        answer: challenge.answer,
        level,
      };
    });

    return res.json(myScore);
  }
}

module.exports = new ScoreBoardController();
