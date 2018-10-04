import { Router, Request, Response } from "express";
import { sendOne } from "../../controller/email.controller";

let emailRouter: Router = Router();

emailRouter.get("/", (req: Request, res: Response) => {
    sendOne("", [], "", "");
    res.send("");
});

export default emailRouter;