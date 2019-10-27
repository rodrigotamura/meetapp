import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class SubscribedMail {
  get key() {
    // when I declare a method with 'get' it's similar
    // to declare a variavel key
    // When we import CancellationMail, we can use CancellationMail.key
    // without use CancellationMail.key()
    // It's very nice because we do not need make constructor to return variables.
    return 'SubscribedMail';
    // we are returning a unique key for this JOB called CancellationMail
  }

  async handle({ data }) {
    /**
     * It will define the tasks that will be executed when this process will be executed
     * If a queue has 10 tasks, each task will execute this handle()
     */

    const { meetup, subscriber, dateMail } = data;

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: 'New subscription in your Meetup',
      template: 'newsubscriber', // not necessary to inform .hbs
      context: {
        // here we set all variables our template is waiting for
        meetup,
        subscriber,
        dateMail,
      },
    });
  }
}

export default new SubscribedMail();
