import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }

  async show(req, res) {
    const profile = await User.findByPk(req.userId, {
      attributes: ['name', 'email'],
    });

    if (!profile) {
      return res.status(400).json({ error: 'User not exists' });
    }

    return res.json({ profile });
  }

  async store(req, res) {
    // validating
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'E-mail already exists' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    // validating
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, value) => (oldPassword ? value.required() : value)),
      confirmPassword: Yup.string()
        .when('password', (password, value) => (password ? value.required().oneOf([Yup.ref('password')]) : value)),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // checking if given email exists
    const user = await User.findByPk(req.userId);
    const { email, oldPassword } = req.body;

    // checking if oldPassword is correct
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match!' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });

      if (emailExists) {
        return res.status(400).json({ error: 'E-mail already exists' });
      }
    }

    // updating
    const { id, name, email: userEmail } = await user.update(req.body);

    return res.json({ id, name, email: userEmail });
  }
}

export default new UserController();
