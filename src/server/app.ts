require('dotenv').load();
import express,  { Request, Response, json, NextFunction } from "express";
import * as winston from "winston";
import emailRouter from "./routers/email.router";
import * as bodyparser from "body-parser";
import { watchForJobs } from "../controller/email.controller";


const PORT = process.env.PORT || 8443;
const VERSION: string = process.env.VERSION || "1.0.0";
const POLL_DURATION: number = +process.env.POLL_DURATION || 100;

export let app: express.Application = express();
let emailApp: express.Application = express();

// create the global logger
export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports:[
        new winston.transports.Console()
    ]
}); 

// configure main application
// allow json encoded payloads
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true,
}));

// Configuring routers
emailApp.use(emailRouter);

app.use("/*", (req: Request, res: Response, next: NextFunction) => {
    logger.info(req.method + " " + req.hostname + " " + req.path);
    next();
});
// configuring main app with subapps
app.get("/", (req: Request, res: Response) => {
    res.send({
        'version': VERSION,
    })
});

// rpc endpoints
app.get("/healthz", (req: Request, res: Response) => {
    res.status(200).send("ok");
});

app.use("/email", emailApp);

// Start watching for jobs
watchForJobs(POLL_DURATION);

app.listen(PORT, () => {
    logger.info("Stating postman server on localhost:" + PORT);
});