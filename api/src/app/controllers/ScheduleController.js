import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';
import File from '../models/File';

class ScheduleController {
  async index(req, res) {
    const { date, page } = req.query;

    const searchDate = parseISO(date);

    const { count, rows: meetups } = await Meetup.findAndCountAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
        user_id: {
          [Op.ne]: [req.userId],
        },
      },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        },
        {
          model: Subscription,
          as: 'subscriptions',
          where: {
            canceled_at: {
              [Op.eq]: null,
            },
          },
          required: false,
        },
      ],
      offset: (page - 1) * 10,
      order: [['date', 'ASC']],
    });

    const response = meetups.filter((meetup) => {
      if (meetup.editable) {
        if (!meetup.subscriptions) {
          return meetup;
        }

        const isSub = meetup.subscriptions.find(
          (sub) => sub.user_id === req.userId,
        );

        if (!isSub) {
          return meetup;
        }

        return null;
      }

      return null;
    });

    const availables = response.map(
      ({
        id, title, desc, localization, date: mDate, organizer, banner,
      }) => ({
        id,
        title,
        desc,
        localization,
        date: mDate,
        organizer,
        banner,
      }),
    );

    return res.json({ availables, count });
  }
}

export default new ScheduleController();
