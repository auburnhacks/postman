import express,  { Request, Response, json, NextFunction } from "express";
import * as winston from "winston";
import emailRouter from "./routers/email.router";
import * as bodyparser from "body-parser";
import { watchForJobs } from "../controller/email.controller";
import * as mongoose from "mongoose";
import { connect } from "mongoose";
import * as fs from "fs";
import * as path from "path";

// helper functions
let downloadEnvVariablesSync = (): string => {
    console.info("downloading secrets: " + __dirname);
    // get the value of the data
    let envFilePath:string = path.join(__dirname, '../../.env');
    console.log("writing env file to: " + envFilePath);
    let envData: string = process.env.ENV_SECRETS;
    if (envData == undefined) {
        console.error("could not locate secrets from kubernetes");
        process.exit(1);
        return undefined;
    }  
    fs.writeFileSync(envFilePath, envData);
    return envFilePath;   
}

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
} else {
    let envFilePath:string = downloadEnvVariablesSync();
    require('dotenv').config({path: envFilePath});
}

// default constants that are required for the application to start normally

// port is a constant that the application uses to bind
const PORT = process.env.PORT || 8443;
// version is a constant that is usually used for debugging purposes
const VERSION: string = process.env.VERSION || "1.0.0";
// poll duration is a constant used for settings the async poll duration from mongodb
const POLL_DURATION: number = +process.env.POLL_DURATION || 100;
// mongo uri is a constant 
const MONGO_URI: string = process.env.MONGO_URI;

// Estabilish connection to mongo
let db = connect(MONGO_URI, {
    useNewUrlParser: true
});
// using the mongoose promise to see if the connection to database was successsfull
db.then((val) => {
    logger.info("connected to mongodb at: " +  MONGO_URI);
}, (reason) => {
    logger.error("error: ", reason);
    // the appplication exits if the connection to mongo was unsuccessful
    process.exit(1);
});

// app is the main application by the server
export let app: express.Application = express();
// emailApp is a express sub application used to serve the email routes
let emailApp: express.Application = express();

// create the global logger with winston
// logger is used throughout the application for debugging purposes
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

// bind the application to the port specified and allow incoming connections
const server = app.listen(PORT, () => {
    logger.info("starting postman server on localhost:" + PORT);
});

// graceful shutdown
process.on('SIGTERM', () =>{
    server.close(() => {
        mongoose.connection
        .close()
        .then(() => process.exit(0), ()=> process.exit(1));
    });
});