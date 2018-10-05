import { Router, Request, Response } from "express";
import { logger } from "../app";

let emailRouter: Router = Router();

emailRouter.get("/", (req: Request, res: Response) => {
    // TODO: send something useful other than hello
    res.status(200).send("hello");
});

emailRouter.post("/queue", (req: Request, res: Response) => {
    let body = req.body;

    let toEmails: Array<string> = body.toEmails as Array<string>;
    let subject: string = body.subject as string || "AuburnHacks 2019";
    let emailText: string = body.emailText as string || "";

    // save this to mongodb and then return


    res.status(201).send("queued");
});

export default emailRouter;