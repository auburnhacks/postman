import { Router, Request, Response } from "express";
import { logger } from "../app";
import { EmailJob, IEmailJobModel } from "../../model/email.model";
import { defaultMailOptions } from "../../email/email.transport";

// emailRouter is used as the global router in the email sub application
// this router is initialized by the emailApp in app.ts
let emailRouter: Router = Router();

// just a default route lol
emailRouter.get("/", (req: Request, res: Response) => {
    // TODO: send something useful other than hello
    res.status(200).send("hello");
});

/*
    * queue endpoint is triggered when a service wants to queue a
    * email job that must be executed.
    * @param json payload 
    * @return json payload
*/
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


/*
    * pending endpoint is triggered when a service wants to see the
    * number of active jobs that are being run by the system at any given time
    * @param json payload
    * @return json payload
*/
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