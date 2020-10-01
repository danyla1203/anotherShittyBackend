import {RedisClient} from "redis";
import {Client} from "pg";

import {dbConnection, redisClient} from "../index";
import {AuthorizationRepositoryI} from "../models/AuthorizationModel";

export class AuthorizationRepository implements AuthorizationRepositoryI {
    redis: RedisClient = redisClient;
    database: Client = dbConnection;

    createSession(session_id: string) {
        this.redis.hset(session_id, "{}");
    }

    async findUserFromDb(userName: string) {
        let user = await this.database.query(`select * from users where name=${userName}`);
        if (user) {
            return user;
        } else {
            return null;
        }
    }
    setTokens(session_id: string, access: string, refresh: string) {

    }

}