import express from "express";
import * as winston from "winston";

const PORT = process.env.PORT || 3000;

export let app = express();

// create the global logger
export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports:[
        new winston.transports.Console()
    ]
}) 


app.listen(PORT, () => {
    logger.info("Stating postman server on localhost:" + PORT);
});