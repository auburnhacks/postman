import { Router, Request, Response } from "express";
import { logger } from "../app";
import { EmailJob, IEmailJobModel } from "../../model/email.model";
import { defaultMailOptions } from "../../email/email.transport";

let emailRouter: Router = Router();

emailRouter.get("/", (req: Request, res: Response) => {
    // TODO: send something useful other than hello
    res.status(200).send("hello");
});

emailRouter.post("/queue", (req: Request, res: Response) => {
    let body = req.body;

    let toEmails: Array<string> = body.to_emails as Array<string>;
    let subject: string = body.subject as string || "AuburnHacks 2019";
    let emailText: string = body.email_text as string || "";

    // save this to mongodb and then return
    var newJob = new EmailJob({
        from: defaultMailOptions.from,
        toEmails: toEmails,
        subject: subject,
        text: emailText
    });

    newJob
    .save()
    .then((job: IEmailJobModel) => {
        res.send(job);
    }, (reason) => {
        logger.error("error: " + reason);
    });
});

emailRouter.get("/pending", (req: Request, res: Response) => {
    EmailJob
    .find()
    .then((jobs: Array<IEmailJobModel>) => {
        res
        .status(200)
        .send(jobs.filter(job => job.pending == true));
    }, (reason) => {
        res.status(500).send(reason);
    });
});

export default emailRouter;