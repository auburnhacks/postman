import { logger } from "../server/app";
import { IEmailJobModel, EmailJob } from "../model/email.model";
import { sendOne } from "../email/email.transport";

let { async } = require("async");

// watchForJobs is a async that runs throughout the lifecycle of the application.
// It runs a function to fetch jobs from mongodb and performs actions accordingly
export let watchForJobs = async (pollTime: number) => {
    logger.info("starting watch poll every " + pollTime + "ms");
    while(true) {
        let pendingJobs = await fetchJobs();
        if (pendingJobs.length > 0) {
            logger.info("picked up " + pendingJobs.length + " jobs");
            while (pendingJobs.length != 0) {
                let job = pendingJobs.pop();
                
                // calling email transport
                let isSent = await sendOne("", job.toEmails,job.subject, job.text);
                if (isSent){
                    logger.info("successfully sent email to: " + job.toEmails);
                    await EmailJob.findOneAndUpdate({_id: job.id}, {$set: { pending: false }});
                }
            }
        }
        await rest(pollTime);
    }
}

// fetchJobs is function that queries mongodb and filters the set and returns
// a promise that only contains jobs that are pending
let fetchJobs = () : Promise<Array<IEmailJobModel>> => {
    return new Promise<Array<IEmailJobModel>>((resolve, reject) => {
        EmailJob
        .find()
        .then((jobs: Array<IEmailJobModel>) => {
            jobs = jobs.filter(job => job.pending == true);
            resolve(jobs);
        }, (reason) => {
            reject(reason);
        });
    });
}

// helper function that just sleeps for a given amount of time
let rest = (interval: number) => {
    return new Promise(resolve => setInterval(resolve, interval));
}