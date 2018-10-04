import * as nodemailer from "nodemailer";

const SMTP_HOST: string = process.env.SMTP_HOST || undefined;
const SMTP_PORT: number = +process.env.SMTP_PORT || undefined;
const SMTP_USER: string = process.env.SMTP_USER || undefined;
const SMTP_PASSWORD: string = process.env.SMTP_PASSWORD || undefined;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
})

const defaultMailOptions: object = {
    from: 'AuburnHacks <' + SMTP_USER + '>'
};