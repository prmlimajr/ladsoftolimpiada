import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

import connection from '../../database/connection';
import Logger from '../../lib/logger';

class UserController {
  async store(req, res) {
    Logger.header('controller - user - store');

    const schema = Yup.object().shape({
      studentId: Yup.string().required(),
      semester: Yup.number().required().positive(),
      course: Yup.string().required(),
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      Logger.error('Validation failed');
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { studentId, semester, course, name, email, password } = req.body;
    Logger.log(
      `[${studentId}][${semester}][${course}][${name}][${email}][${password}]`
    );

    /**
     * Verifies if the user already exists.
     */
    const [emailExists] = await connection('users')
      .select('users.*')
      .where({ 'users.email': email });

    if (emailExists) {
      Logger.error('User already exists');
      return res.status(403).json({ error: 'User already exists' });
    }

    const [studentIdExists] = await connection('users')
      .select('users.*')
      .where({ 'users.studentId': studentId });

    if (studentIdExists) {
      Logger.error('User already exists');
      return res.status(403).json({ error: 'User already exists' });
    }

    /**
     * encrypts the password.
     */
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      studentId,
      semester,
      course,
      name,
      email,
      password_hash: hashedPassword,
    };

    /**
     * Inserts into database and returns user
     */
    const [userId] = await connection('users').insert(user, 'id');

    Logger.success('[200]');
    return res.json({
      id: userId,
      ...user,
    });
  }

  async update(req, res) {
    Logger.header('controller - user - update');

    const {
      studentId,
      semester,
      course,
      name,
      email,
      oldPassword,
      password,
      confirmPassword,
    } = req.body;

    Logger.header(
      `[${studentId}][${semester}][${name}][${email}][${oldPassword}][${password}][${confirmPassword}]`
    );

    /**
     * Inputs validator
     */
    const schema = Yup.object().shape({
      semesterId: Yup.number().positive(),
      course: Yup.string(),
      name: Yup.string(),
      emai: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      Logger.error('Validation failed');
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [userExists] = await connection('users')
      .select('users.*')
      .where({ 'users.id': req.userId });

    /**
     * Checks if the email is already in the database
     */
    if (email) {
      if (userExists.email === email) {
        Logger.error('Email already in use');
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    /**
     * Checks if the studentId is already in the database
     */
    if (studentId) {
      if (userExists.studentId === studentId) {
        Logger.error('studentId already in use');
        return res.status(400).json({ error: 'studentId already in use' });
      }
    }

    /**
     * Validates if the inputed password is the same as stored password
     */
    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists.password_hash);
    };

    const hashedPassword = password
      ? await bcrypt.hash(password, 8)
      : userExists.password_hash;

    if (oldPassword && !(await checkPassword(oldPassword))) {
      Logger.error('Password does not match');
      return res.status(401).json({ error: 'Password does not match' });
    }

    const user = {
      studentId: studentId || userExists.studentId,
      course: course || userExists.course,
      name: name || userExists.name,
      email: email || userExists.email,
      password_hash: hashedPassword,
    };

    await connection('users').update(user).where({ id: req.userId });

    Logger.success('[200]');
    return res.json({
      id: req.userId,
      ...user,
    });
  }
}

export default new UserController();
