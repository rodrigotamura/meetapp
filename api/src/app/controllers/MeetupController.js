import {
  parseISO, startOfDay, isBefore,
} from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';
import File from '../models/File';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    // paginating & filtering by date
    const { page = 1, date: dateFilter } = req.query;
    const itensPerPage = 10;

    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
        date: {
          [Op.gt]: startOfDay(parseISO(dateFilter)),
        },
      },
      attributes: ['id', 'title', 'description', 'localization', 'date'],
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path'],
        },
      ],

      limit: itensPerPage,
      offset: (page - 1) * itensPerPage,
    });


    return res.json(meetups);
  }

  async store(req, res) {
    // validating
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const {
      title, description, localization, date, banner_id, user_id,
    } = req.body;

    // checking if date is already passed
    const dateStart = startOfDay(parseISO(date));
    if (isBefore(dateStart, new Date())) {
      return res.status(400).json({ error: 'You cannot choose a past date' });
    }

    const meetup = await Meetup.create({
      title, description, localization, date, banner_id, user_id: req.userId,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      banner_id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // getting meetup
    const meetup = await Meetup.findByPk(req.params.id);

    // checking if user is owner of meetapp
    if (req.userId !== meetup.user_id) {
      return res.status(401).json({ error: 'You do not have permition to update this Meetup' });
    }

    // checking if Meetapp has not happened yet
    const dateMeetupPassed = startOfDay(meetup.date);
    if (isBefore(dateMeetupPassed, new Date())) {
      return res.status(400).json({ error: 'You cannot update this Meetup: already happened' });
    }

    // checking if new date is already passed
    const dateStart = startOfDay(parseISO(req.body.date));
    if (isBefore(dateStart, new Date())) {
      return res.status(400).json({ error: 'You cannot choose a past date' });
    }

    // updating
    const {
      title, description, localization, date, image, user_id, banner_id,
    } = await meetup.update(req.body);

    return res.json({
      title, description, localization, date, image, user_id, banner_id,
    });
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    // checking if user is owner of Meetup
    if (req.userId !== meetup.user_id) {
      return res.status(401).json({ error: 'You do not have authorization to delete this Meetup.' });
    }

    // checking if this Meetup have not happened
    const dateStart = startOfDay(meetup.date);
    if (isBefore(dateStart, new Date())) {
      return res.status(400).json({ error: 'You cannot delete old Meetups' });
    }

    // destroying register
    await meetup.destroy();

    return res.json();
  }

  async show(req, res) {
    // getting meetup
    const meetup = await Meetup.findByPk(req.params.id, {
      where: {
        user_id: req.userId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'name', 'path'],
        },
      ],
    });
    meetup.banner.url = `${process.env.APP_URL}:${process.env.APP_PORT}/${meetup.banner.path}`;

    return res.json({ meetup });
  }
}

export default new MeetupController();
