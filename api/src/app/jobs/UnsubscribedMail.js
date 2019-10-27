import Mail from '../../lib/Mail';

class UnsubscribedMail {
  get key() {
    // when I declare a method with 'get' it's similar
    // to declare a variavel key
    // When we import CancellationMail, we can use CancellationMail.key
    // without use CancellationMail.key()
    // It's very nice because we do not need make constructor to return variables.
    return 'UnsubscribedMail';
    // we are returning a unique key for this JOB called CancellationMail
  }

  async handle({ data }) {
    /**
     * It will define the tasks that will be executed when this process will be executed
     * If a queue has 10 tasks, each task will execute this handle()
     */

    const { subscription } = data;

    const sent = await Mail.sendMail({
      to: `${subscription.meetup.organizer.name} <${subscription.meetup.organizer.email}>`,
      subject: 'Unsubscribed in your Meetup',
      template: 'cancelsubscriber', // not necessary to inform .hbs
      context: {
        // here we set all variables our template is waiting for
        subscription,
      },
    });
  }
}

export default new UnsubscribedMail();
