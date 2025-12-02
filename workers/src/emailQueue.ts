import {redisClient} from './redisClient';
import {Queue} from 'bullmq';
import logger from './logger';

const EMAIL_QUEUE_KEY = 'emailQueue';

export interface EmailJob {
  type: 'formSubmission' | 'supportTicket';
  to: string;
  data: Record<string, any>;
}

const emailQueue = new Queue<EmailJob>(EMAIL_QUEUE_KEY, {
  connection: redisClient,
});


export default emailQueue;