import * as nodemailer from "nodemailer";
import { logger } from "../server/app";

// all required constants that are needed by nodemailer to run perfecto
const SMTP_HOST: string = process.env.SMTP_HOST;
const SMTP_PORT: string = process.env.SMTP_PORT;
const SMTP_USER: string = process.env.SMTP_USER;
const SMTP_PASSWORD: string = process.env.SMTP_PASSWORD;
const SMTP_CONTACT: string = process.env.SMTP_CONTACT;

interface MailOptions {
    from: string;
    to?: Array<string>;
    subject?: string;
    text?: string;
    html?: string;
}

export let defaultMailOptions: MailOptions = {
    from: "AuburnHacks Team <" + SMTP_USER + ">"
};

// transporter is the default email transport used by the application
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    },
    pool: true,
});

/*
    * sendOne is a function that sends an email with the given parameters.
    @param emailType string
    @param toEmails Array<string>
    @param subject string
    @param body string
    @return Promise<boolean>
*/
export let sendOne = (emailType: string, toEmails: Array<string>, subject: string, body: string) : Promise<boolean> => {
    return new Promise((resolve, reject) => {
        for (let to of toEmails) {
            let mailOptions = {
                from: SMTP_CONTACT,
                to: to,
                subject: subject,
                text: body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error("error sending email: " + error.message);
                    reject(error);
                } else {
                    logger.info("Message sent: " + info.messageId);
                }
            });
        }
        resolve(true);
    });
}


let sleep = (duration: number) => {
    return new Promise(resolve => setInterval(resolve, duration));
};
