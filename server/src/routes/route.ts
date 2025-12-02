import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../lib/auth';

// importing route modules
import project_v1 from './v1/project.routes';
import submission_v1 from './v1/submission.routes';
import ticket_v1 from './v1/ticket.routes';

const router = express.Router();


router.get('/', (req, res) => {
  res.send('Hello from Formiq server!');
});

router.use('/auth', toNodeHandler(auth));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/v1/projects', project_v1);
router.use('/v1/submissions', submission_v1);

router.use('/v1/tickets', ticket_v1);


export default router;
