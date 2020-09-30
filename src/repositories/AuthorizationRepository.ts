import {RedisClient} from "redis";
import {Client} from "pg";
import * as crypto from "crypto";

import {dbConnection, redisClient} from "../index";
import {AuthorizationRepositoryI} from "../models/AuthorizationModel";

export class AuthorizationRepository implements AuthorizationRepositoryI {
    redis: RedisClient = redisClient;
    database: Client = dbConnection;

    createSession(ip: string, userAgent: string) {
        let session_id = crypto.createHash("sha256")
                                .update(ip + userAgent)
                                .digest("hex");
        this.redis.hset(session_id, "{}");
    }

    async findUser(userName: string) {
        let user = this.database.query(`select * from users where name=${userName}`);
        if (user) {
            return user;
        } else {
            return null;
        }
    }

}