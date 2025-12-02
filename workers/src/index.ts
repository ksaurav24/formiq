 // emailWorker.ts
import { Worker, Job } from 'bullmq';
import { redisClient } from './redisClient';
import logger from './logger';
import type { EmailJob } from './emailQueue';
import { mailTemplates, sendEmail } from './sendgrid';

const EMAIL_QUEUE_KEY = 'emailQueue';

const worker = new Worker<EmailJob>(
  EMAIL_QUEUE_KEY,
  async (job: Job<EmailJob>) => {
    const templateId = mailTemplates[job.data.type || job.name];
    if (!templateId) {
        throw new Error(`No template ID configured for email type: ${job.data.type}`);
    }
    const response = await sendEmail(
      job.data.to,
      templateId,
      job.data.data
    );
    // No-op processing: just logging; return a small result for completed event
    return { status: 'sent', responseCode: response[0].statusCode };
  },
  {
    connection: redisClient, 
    concurrency: 5,
  }
);

// Worker-level events for visibility
worker.on('completed', (job, returnvalue) => {
  logger.info('[emailQueue] Completed job', {
    id: job.id,
    name: job.name,
    type: job.data?.type,
    to: job.data?.to,
    returnvalue,
  });
});

worker.on('failed', (job, err) => {
  logger.error('[emailQueue] Failed job', {
    id: job?.id,
    name: job?.name,
    type: job?.data?.type,
    to: job?.data?.to,
    error: err?.message,
    stack: err?.stack,
  });
});

worker.on('error', (err) => {
  // Worker-level runtime errors (e.g., Redis connection issues)
  logger.error('[emailQueue] Worker error', { error: err.message, stack: err.stack });
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  try {
    logger.info(`[emailQueue] Shutting down worker on ${signal}`);
    await worker.close(); // closes Redis connections and stops processing
    process.exit(0);
  } catch (err: any) {
    logger.error('[emailQueue] Error during shutdown', { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => shutdown(sig));
});

export default worker;
