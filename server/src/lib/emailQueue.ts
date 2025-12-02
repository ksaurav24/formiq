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

// Function to add email job to the queue which returns true on success and false on failure

export const enqueueEmailJob = async (job: EmailJob): Promise<boolean> => {
    try {
        await emailQueue.add(job.type, job);
        return true;
    } catch (error) {
        logger.error('Error adding email job to queue:', error);
        return false;
    }
}


export default emailQueue;