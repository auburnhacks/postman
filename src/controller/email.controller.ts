import * as nodemailer from "nodemailer";
import { logger } from "../server/app";

const SMTP_HOST: string = process.env.SMTP_HOST || undefined;
const SMTP_PORT: number = +process.env.SMTP_PORT || undefined;
const SMTP_USER: string = process.env.SMTP_USER || undefined;
const SMTP_PASSWORD: string = process.env.SMTP_PASSWORD || undefined;


interface LooseObject {
    [key : string]: any;
}

let defaultMailOptions: LooseObject = {};

// add default SMTP_USER
defaultMailOptions.from = SMTP_USER;


let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
});

let setEmailOption = (key: any, value: any) => {
    defaultMailOptions.key = value;
};


function createMailOptions(toEmail: Array<string>, subject: string, body: string,) {
    
}

transporter.sendMail(defaultMailOptions, (error, info) => {
    if (error) {
        logger.error(error);
    } else {
       logger.info(info.messageId);
    }
});

export let sendOne = (emailType: string, toEmails: Array<string>, subject: string, body: string) : boolean => {
    logger.info("got parameters");

    return true;
}