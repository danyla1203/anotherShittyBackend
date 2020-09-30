import * as express from "express";
import * as redis from "promise-redis";
import {Client} from "pg";

import {Bootstrap} from "./bootstrap";
import {ArticleController} from "./controllers/ArticleController";
import {AuthorizationRepository} from "./repositories/AuthorizationRepository";

const app = express();

//create connection to data storage
export const redisClient = redis().createClient();
redisClient.on("error", (error) => {
    console.error(error);
});
export const dbConnection = new Client({
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "root",
});
dbConnection.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
});

//put new controllers here
const controllers = [
    new ArticleController()
];
const bootstrap = new Bootstrap(controllers);

bootstrap.start(app);

app.listen(3000);


const test = new AuthorizationRepository();
test.findUser("bitch");