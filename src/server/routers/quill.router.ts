import { Router, Request, Response, NextFunction } from "express";
import { MongoClient, MongoError, Db, Collection, FilterQuery } from "mongodb";
import { logger } from "../app";

const QUILL_MONGO_URI = process.env.QUILL_MONGO_URI || undefined;

let quillRouter: Router = Router();

quillRouter.get("/", (req: Request, res: Response) => {
    res.status(200).send("quill proxy router\n");
});

quillRouter.post("/query", (req: Request, res: Response) => {
    if (!QUILL_MONGO_URI) {
        res.status(500).send({error: "quill mongodb not found"});
    }
    MongoClient.connect(QUILL_MONGO_URI, {useNewUrlParser: true}, (err: MongoError, quillClient: MongoClient)  => {
        if (err) {
            res.status(500).send(err);
        }
        let body = req.body;
        logger.info("connected to quill mongodb");
        const quillDB: Db = quillClient.db();
        const userCollection: Collection = quillDB.collection("users");
        logger.info("running query");
        logger.debug(JSON.stringify(body));
        userCollection.find(req.body.query).maxTimeMS(10000).toArray((err, docs) => {
            let emails: Array<string> = new Array<string>();
            for (let doc of docs) {
                emails.push(doc.email);
            }
            res.status(200).send({emails: emails});
        });
    });
});

export default quillRouter;