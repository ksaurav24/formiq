import sgmail from '@sendgrid/mail';
import logger from './logger';

sgmail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Function to send email using SendGrid
export const sendEmail = async (to: string, templateId: string, dynamicTemplateData: Record<string, any>) => {
    const msg = {
        to,
        from: process.env.SUPPORT_EMAIL || 'formiq@devxsaurav.in',
        templateId,
        dynamicTemplateData,
    };

    try {
        const response = await sgmail.send(msg);
        logger.info('[sendEmail] Email sent successfully', { to, templateId });
        return response;
    } catch (error) {
        logger.error('[sendEmail] Error sending email', { to, templateId, error });
        throw error;
    }
};

export const mailTemplates = {
    formSubmission: process.env.FORM_SUBMISSION_TEMPLATE_ID || '',
    supportTicket: process.env.SUPPORT_TICKET_TEMPLATE_ID || '',
}