import { Schema, Model, model, Document } from "mongoose";

// IEmailJobModel is an interface hat is used throughout postman to reference all the jobs running
export interface IEmailJobModel extends Document {
    // from is a string that sisnifies that who this email originates
    from?: string,
    // toEmails is an array of emails that the job has to send
    toEmails: Array<string>,
    // subject is the subject of the email
    subject: string,
    // text is the body of the email
    text: string,
    // pending is a boolean that signifies whether a job still pending to be run
    pending: boolean,
    // isHTML is a boolean that indicates whether a email has to sent out
    // in HTML mode instead of plain text.
    isHTML: boolean
}

var emailJobSchema = new Schema({
    from: String,
    toEmails: [String],
    subject: String,
    text: String,
    pending: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isHTML: {
        type: Boolean,
        default: false
    }
});

// EmailJob is the exported class used by the application to run mongodb queies against this schema
export const EmailJob: Model<IEmailJobModel> = model<IEmailJobModel>("EmailJob", emailJobSchema, "jobs");
