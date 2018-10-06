require('dotenv').load();
import express,  { Request, Response, json, NextFunction } from "express";
import * as winston from "winston";
import emailRouter from "./routers/email.router";
import * as bodyparser from "body-parser";
import { watchForJobs } from "../controller/email.controller";
import * as mongoose from "mongoose";
import { connect } from "mongoose";


const PORT = process.env.PORT || 8443;
const VERSION: string = process.env.VERSION || "1.0.0";
const POLL_DURATION: number = +process.env.POLL_DURATION || 100;
const MONGO_URI: string = process.env.MONGO_URI;

// Estabilish connection to mongo
let db = connect(MONGO_URI, {
    useNewUrlParser: true
});
db.then((val) => {
    logger.info("connected to mongodb at: " +  MONGO_URI);
}, (reason) => {
    logger.error("error: ", reason);
});

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
    logger.info("starting postman server on localhost:" + PORT);
});