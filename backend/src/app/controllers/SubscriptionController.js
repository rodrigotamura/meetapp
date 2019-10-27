import { Op } from 'sequelize';
import * as Yup from 'yup';
import {
  parseISO, startOfDay, startOfHour, endOfHour, isBefore, format,
} from 'date-fns';
import SubscribedMail from '../jobs/SubscribedMail';
import UnsubscribedMail from '../jobs/UnsubscribedMail';
import Queue from '../../lib/Queue';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class SubscriptionController {
  async index(req, res) {
    const subscripted = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [{
        where: { date: { [Op.gte]: new Date() } },
        model: Meetup,
        as: 'meetup',
        attributes: ['id', 'title', 'date', 'localization'],
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        }, {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        }],
      }],
    });

    return res.json(subscripted);
  }

  /**
   * Subscribing user
   * @param req
   * @param res
   */
  async store(req, res) {
    // validating given data
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    const user_id = req.userId;
    const { meetup_id } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // getting meetup
    const meetup = await Meetup.findByPk(req.body.meetup_id, {
      include: [
        // getting Meetup's owner
        {
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        },
      ],
    });

    // verifying existance of meetup
    if (!meetup) {
      return res.status(400).json({ error: 'The given meetup does not exist' });
    }

    // verify if user is not owner of given meetup
    if (req.userId === meetup.user_id) {
      return res.status(400).json({ error: 'You cannot subscript in Meetup that you created' });
    }

    // verifying if given Meetup has not happened
    const dateStart = startOfDay(meetup.date);
    if (isBefore(dateStart, new Date())) {
      return res.status(400).json({ error: 'The given Meetup already has happened.' });
    }

    // verifying if user is already not subscribed in this meetup
    const isSubscribed = await Subscription.findOne({
      where: {
        user_id,
        meetup_id,
      },
    });
    if (isSubscribed) {
      return res.status(400).json({ error: 'You already are subscribed in this Meetup' });
    }

    // verifying if this user is not alread subscribed in another
    // meetup that is the same TIME
    const meetupSelectedDateNumber = Number(meetup.date);
    const meetupConflictTime = await Meetup.findOne({
      where: {
        user_id: { [Op.not]: req.userId },
        id: { [Op.not]: meetup_id },
        date: {
          [Op.between]:
          [
            startOfHour(meetupSelectedDateNumber),
            endOfHour(meetupSelectedDateNumber),
          ],
        },
      },
    });
    if (meetupConflictTime) {
      return res.status(400).json({ error: 'You are already subscribed in another Meetup that will occur in same time of given Meetup.' });
    }

    // Subscribing
    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id,
    });

    // Sending mail to Meetup`s owner
    const subscriber = await User.findByPk(req.userId, {
      attributes: ['name', 'email'],
    });

    // formatting date of meetup
    const dateMail = format(meetup.date, "do MMMM',' yyyy', at' hh':'mm");

    await Queue.add(SubscribedMail.key, {
      meetup, subscriber, dateMail,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      // getting subscription infos
      const subscription = await Subscription.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'email'],
          },
          {
            model: Meetup,
            as: 'meetup',
            attributes: ['title', 'localization', 'date'],
            include: [{
              model: User,
              as: 'organizer',
              attributes: ['name', 'email'],
            }],
          },
        ],
      });

      // Unsubscribing
      await Subscription.destroy({
        where: { id },
      });

      // formatting date of meetup
      await Queue.add(UnsubscribedMail.key, {
        subscription,
      });

      return res.json('Subscription canceled successfully!');
    } catch (HttpError) {
      return res.status(HttpError.code).json({ error: HttpError.message });
    }
  }
}

export default new SubscriptionController();
