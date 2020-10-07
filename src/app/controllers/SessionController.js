const jwt = require('jsonwebtoken');
const Yup = require('yup');
const bcrypt = require('bcryptjs');
const connection = require('../../database/connection');
const authConfig = require('../../config/auth');
const Logger = require('../../lib/logger');

class SessionController {
  async store(req, res) {
    Logger.header('controller - session - store');

    const { email, password } = req.body;
    Logger.log(`[${email}][${password}]`);

    /**
     * Inputs validator
     */
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid(req.body))) {
      Logger.error('Validation failed');
      return res.status(400).json({ error: 'Validation failed' });
    }

    /**
     * Verifies if the email is already in use.
     */
    const [userExists] = await connection('users')
      .select('users.*')
      .where({ 'users.email': email });

    if (!userExists) {
      Logger.error('User not found');
      return res.status(400).json({ error: 'User not found' });
    }

    /**
     * Compares both inputed password and stored password
     */
    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists.password_hash);
    };

    if (!(await checkPassword(password))) {
      Logger.error('Password does not match');
      return res.status(401).json({ error: 'Password does not match' });
    }

    Logger.success('[200]');
    return res.json({
      user: {
        id: userExists.id,
        name: userExists.name,
        email,
        studentId: userExists.studentId,
        course: userExists.course,
        semester: userExists.semester,
      },
      token: jwt.sign({ id: userExists.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
