import Meetup from '../models/Meetup';
import { parseISO, startOfDay, isBefore } from 'date-fns';
import * as Yup from 'yup';
import User from '../models/User';

class MeetupController {
  async index(req, res){
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId
      },
      attributes: ['id', 'title', 'description', 'localization', 'date', 'image'],
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ]
    });

    return res.json(meetups);
  }

  async store(req, res){

    // validating
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
      image: Yup.string().required(),
      user_id: Yup.number().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error:"Validation failed"});
    }

    const { title, description, localization, date, image, user_id } = req.body;

    // checking if date is already passed
    const dateStart = startOfDay(parseISO(date));
    if(isBefore(dateStart, new Date())){
      return res.status(400).json({error: 'You cannot choose a past date'});
    }

    const meetup = await Meetup.create({
      title, description, localization, date, image, user_id
    });

    return res.json(meetup);
  }

  async update(req, res){
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
    });
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation failed'});
    }

    // getting meetup
    const meetup = await Meetup.findByPk(req.params.id);

    // checking if user is owner of meetapp
    if(req.userId !== req.body.user_id){
      return res.status(401).json({error: 'You do not have permition to update this Meetup'});
    }

    // checking if Meetapp has not happened yet
    const dateMeetupPassed = startOfDay(meetup.date);
    if(isBefore(dateMeetupPassed, new Date())){
      return res.status(400).json({error:'You cannot update this Meetup: already happened'})
    }

    // checking if new date is already passed
    const dateStart = startOfDay(parseISO(req.body.date))
    if(isBefore(dateStart, new Date())){
      return res.status(400).json({error: 'You cannot choose a past date'});
    }

    // updating
    const {title, description, localization, date, image, user_id} = await meetup.update(req.body);

    return res.json({title,description,localization,date,image,user_id});


  }

  async delete(req, res){
    const meetup = await Meetup.findByPk(req.params.id);

    // checking if user is owner of Meetup
    if(req.userId !== meetup.user_id){
      return res.status(401).json({error: 'You do not have authorization to delete this Meetup.'});
    }

    // checking if this Meetup have not happened
    const dateStart = startOfDay(meetup.date);
    if(isBefore(dateStart, new Date())){
      return res.status(400).json({error: 'You cannot delete old Meetups'});
    }

    // destroying register
    await meetup.destroy();

    return res.json();
  }
}

export default new MeetupController();