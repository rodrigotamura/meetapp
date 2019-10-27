import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import SubscribedMail from '../app/jobs/SubscribedMail';
import UnsubscribedMail from '../app/jobs/UnsubscribedMail';

const jobs = [SubscribedMail, UnsubscribedMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          // here we store our queue
          redis: redisConfig,
        }),
        handle, // this will process the current job
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
