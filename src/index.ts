import * as express from "express";
import * as redis from "redis";

import {Bootstrap} from "./bootstrap";
import {ArticleController} from "./controllers/ArticleController";

const app = express();

//create connection to data storage
export const redisClient = redis.createClient();
redisClient.on("error", (error) => {
    console.error(error);
});
export const dbConnection = null;

//put new controllers here
const controllers = [
    new ArticleController()
];
const bootstrap = new Bootstrap(controllers);

bootstrap.start(app);

app.listen(3000);