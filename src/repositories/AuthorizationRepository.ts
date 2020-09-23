import {RedisClient} from "redis";
import {redisClient} from "../index";
import {AuthorizationRepositoryI} from "../models/AuthorizationModel";

export class AuthorizationRepository implements AuthorizationRepositoryI{
    connection: RedisClient = redisClient;
    constructor() {
        //if no user_sessions hash -> create new hash;
        if (!this.connection.exists("user_sessions")) {
            this.connection.hset("user_sessions");
        }
    }

    findUser(userName: string) {

    }

}