require('dotenv').load();
import express,  { Request, Response, json } from "express";
import * as winston from "winston";
import emailRouter from "./routers/email.router";


const PORT = process.env.PORT || 8443;
const VERSION: string = process.env.VERSION || "1.0.0";

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

// Configuring routers
emailApp.use(emailRouter);

// configuring main app with subapps
app.get("/", (req: Request, res: Response) => {
    res.send({
        'version': VERSION,
    })
});
app.use("/email", emailApp);


app.listen(PORT, () => {
    logger.info("Stating postman server on localhost:" + PORT);
});