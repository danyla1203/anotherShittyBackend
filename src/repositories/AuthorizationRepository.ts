import {RedisClient} from "redis";
import * as crypto from "crypto";

import {redisClient} from "../index";
import {AuthorizationRepositoryI} from "../models/AuthorizationModel";

export class AuthorizationRepository implements AuthorizationRepositoryI {
    connection: RedisClient = redisClient;
    hashName: string = "users_sessions";

    constructor() {
        //if no user_sessions hash -> create new hash;
        if (!this.connection.exists(this.hashName)) {
            this.connection.hset(this.hashName);
        }
    }

    createSession(ip: string, userAgent: string) {
        let session_id = crypto.createHash("sha256")
                                .update(ip + userAgent)
                                .digest("hex");
        this.connection.hsetnx(this.hashName, session_id, "{}");
    }

    findUser(userName: string) {

    }

}