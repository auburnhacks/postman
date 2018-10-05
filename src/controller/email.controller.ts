import { logger } from "../server/app";

let { async } = require("async");


export let watchForJobs = async (pollTime: number) => {
    logger.info("starting watch poll every " + pollTime + "ms");
    while(true) {
        await rest(pollTime);
    }
}


let fetchJobs = () : Array<object> => {
    return undefined;
}

// helper function that just sleeps for a given amount of time
let rest = (interval: number) => {
    return new Promise(resolve => setInterval(resolve, interval));
}