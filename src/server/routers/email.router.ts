import { Router, Request, Response } from "express";

let emailRouter: Router = Router();

emailRouter.get("/", (req: Request, res: Response) => {
    res.send("hello");
});

export default emailRouter;