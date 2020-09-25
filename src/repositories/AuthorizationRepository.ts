import {RedisClient} from "redis";
import * as crypto from "crypto";

import {redisClient} from "../index";
import {AuthorizationRepositoryI} from "../models/AuthorizationModel";

export class AuthorizationRepository implements AuthorizationRepositoryI {
    connection: RedisClient = redisClient;

    createSession(ip: string, userAgent: string) {
        let session_id = crypto.createHash("sha256")
                                .update(ip + userAgent)
                                .digest("hex");
        this.connection.hset(session_id, "{}");
    }

    findUser(userName: string) {

    }

}