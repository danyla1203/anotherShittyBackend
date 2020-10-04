import * as express from "express";
import * as redis from "promise-redis";
import * as dotenv from "dotenv";
import {Client} from "pg";

import {Bootstrap} from "./bootstrap";
import {ArticleController} from "./controllers/ArticleController";
import {AuthorizationRepository} from "./repositories/AuthorizationRepository";
import {RedisError} from "redis";
import {AuthorizationController} from "./controllers/AuthorizationController";
import {AuthorizationModel} from "./models/AuthorizationModel";
import {ArticleModel} from "./models/ArticleModel";
import {ArticleRepository} from "./repositories/ArticleRepository";

const app = express();
dotenv.config();

//create connection to data storage
export const redisClient = redis().createClient();
redisClient.on("error", (error: RedisError) => {
    console.error(error);
});
export const dbConnection = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_BASE,
    password: process.env.DB_PASS
});
dbConnection.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
});
//creating repositories
const authRepo = new AuthorizationRepository(redisClient, dbConnection);
const articleRepo = new ArticleRepository();

//creating models
const authModel = new AuthorizationModel(authRepo);
const articleModel = new ArticleModel(articleRepo);

//put new controllers here
const controllers = [
    new ArticleController(articleModel),
    new AuthorizationController(authModel)
];
const bootstrap = new Bootstrap(controllers);

bootstrap.start(app);

app.listen(3000);