import * as nodemailer from "nodemailer";
import { logger } from "../server/app";

const SMTP_HOST: string = process.env.SMTP_HOST;
const SMTP_PORT: string = process.env.SMTP_PORT;
const SMTP_USER: string = process.env.SMTP_USER;
const SMTP_PASSWORD: string = process.env.SMTP_PASSWORD;

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

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
});

export let sendOne = (emailType: string, toEmails: Array<string>, subject: string, body: string) : Promise<boolean> => {
    return new Promise((resolve, reject) => {
        for (let to of toEmails) {
            let mailOptions = {
                from: "AuburnHacks <auburnhacks@gmail.com>",
                to: to,
                subject: subject,
                html: body,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error("error sending email: " + error.message);
                    reject(error);
                } else {
                    logger.info("Message sent: " + info.messageId);
                    resolve(true);
                }
            });
        }
    });
}
