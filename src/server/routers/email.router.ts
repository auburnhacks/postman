import { Router, Request, Response } from "express";
import { logger } from "../app";

let emailRouter: Router = Router();

emailRouter.get("/", (req: Request, res: Response) => {
    res.send({
        "response": "starting job",
    });
});

export default emailRouter;