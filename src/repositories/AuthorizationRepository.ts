import {RedisClient} from "redis";
import {redisClient} from "../index";

export class AuthorizationRepository {
    connection: RedisClient = redisClient;
    constructor() {
        //if no user_sessions hash -> create new hash;
        if (!this.connection.exists("user_sessions")) {
            this.connection.hset("user_sessions");
        }
    }



}