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
console.log("loading env variables...");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
} else {
    let envFilePath:string = downloadEnvVariablesSync();
    require('dotenv').config({path: envFilePath});
}

import express,  { Request, Response, json, NextFunction } from "express";
import * as winston from "winston";
import emailRouter from "./routers/email.router";
import * as bodyparser from "body-parser";
import { watchForJobs } from "../controller/email.controller";
import * as mongoose from "mongoose";
import { connect } from "mongoose";
import * as jwt from "jsonwebtoken";

// default constants that are required for the application to start normally

// port is a constant that the application uses to bind
const PORT = process.env.PORT || 8443;
// version is a constant that is usually used for debugging purposes
const VERSION: string = process.env.VERSION || "1.0.0";
// poll duration is a constant used for settings the async poll duration from mongodb
const POLL_DURATION: number = +process.env.POLL_DURATION || 100;
// mongo uri is a constant 
const MONGO_URI: string = process.env.MONGO_URI;
// jwt secret is the secret used by the jsonwebtoken library for siging and issuing tokens
const JWT_SECRET: string = process.env.JWT_SECRET;

var users = Array();

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
    level: process.env.LOG_LEVEL || 'debug',
    format: winston.format.simple(),
    transports:[
        new winston.transports.Console()
    ]
}); 

var isVerified = (req: Request, res: Response, next: NextFunction) => {
    let authHeader: string = req.headers['authorization'];
    if (authHeader == undefined) {
        res.status(403).send({
            error: "no authenication header found"
        });
        return
    }
    let token = authHeader.split(' ');
    jwt.verify(token[1], JWT_SECRET, (error, data) => {
        if (error) {
            res.status(403).send({
                "error": "accedding forbidden endpoint " + req.method
            });
            return
        }
        next();
    });
};

let loadVerfiedUsers = (userFilePath: string) => {
    let userData: string = fs.readFileSync(userFilePath, "utf-8");
    let parsedUsers = JSON.parse(userData);
    for (let u of parsedUsers.users) {
        users.push(u as Map<string, any>);
    }
};

let verifyUser = (username: string, password: string): boolean => {
    for (let user of users) {
        if (user['username'] == username && user['password'] == password) {
            return true;
        }
    }
    return false;
};

// load all verfified users
loadVerfiedUsers(path.join(__dirname, '../../users.json'));
logger.debug(JSON.stringify(users));

// configure main application
// allow json encoded payloads
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true,
}));

// Configuring routers
// emailApp.use(isVerified, emailRouter);
// TODO: (kirandasika98) revert back to JWT
emailApp.use(emailRouter);

if (process.env.NODE_ENV !== "production") {
    app.use("/*", (req: Request, res: Response, next: NextFunction) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
}

// configuring main app with subapps
app.get("/", (req: Request, res: Response) => {
    res.send({
        'version': VERSION,
    })
});

// authentication endpoints
app.post("/token", (req: Request, res: Response) => {
    let userData = req.body;
    if (verifyUser(userData.username, userData.password)) {
        let token: string = jwt.sign({userData}, JWT_SECRET);
        res.send({token});
    } else {
        res.status(403).send({
            error: "unable to verify user"
        })
    }
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
