// Ticket controller
import { asyncHandler } from "../lib/asyncHandler";
import { enqueueEmailJob } from "../lib/emailQueue";
import logger from "../lib/logger";
import { errorResponse, successResponse } from "../lib/response";
import Ticket from "../models/ticket.model";


export const createTicket = asyncHandler(async (req,res) => {
    // get the values from req
    const {name,email,subject,description,priority,category, projectId, url, steps, expected, actual } = req.body

    const ticket = new Ticket({
        name,
        email,
        subject,
        description,
        priority,
        category,
        projectId,
        url,
        steps,
        expected,
        actual,
        status:"open"
    })

    if(!ticket){
        res.status(500).send(errorResponse(500, "Failed to raise the ticket"))
    }

    await ticket.save()

    // TODO enqueue the mail job to support mail
    const emailJob = await enqueueEmailJob({
        type: 'supportTicket',
        to: process.env.SUPPORT_EMAIL || 'formiq@devxsaurav.in',
        data: {
            ticketId: ticket._id,
            ticketFields: {
                name,
                email,
                subject,
                description,
                priority,
                category,
                projectId:projectId||"not provided",
                url:url||"not provided",
                steps:steps||"not provided",
                expected:expected||"not provided",
                actual:actual||"not provided"
            }
        }
    })
    if(!emailJob){
        logger.error("Failed to enqueue email job for support ticket", {ticketId: ticket._id} )
    }
    // send the response
    res.status(201).send(successResponse(201, "Ticket raised successfully", ticket))
})