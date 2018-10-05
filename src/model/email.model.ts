import { Schema, Model, model, Document } from "mongoose";

export interface IEmailJobModel extends Document {
    from?: string,
    toEmails: Array<string>,
    subject: string,
    text: string,
    pending: boolean,
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
});

export const EmailJob: Model<IEmailJobModel> = model<IEmailJobModel>("EmailJob", emailJobSchema, "jobs");
