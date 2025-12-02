import { createTicket } from '../../controllers/ticket.controller'
import express from 'express'
import { validateRequest } from'../../middleware/validation.middleware'

const router = express.Router()

router.post('/',validateRequest('createTicket'),createTicket)

export default router