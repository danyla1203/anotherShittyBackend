import {RedisClient} from "redis";
import {Client} from "pg";

import {AuthorizationRepositoryI} from "../models/AuthorizationModel";

export class AuthorizationRepository implements AuthorizationRepositoryI {
    redis: RedisClient;
    database: Client;

    constructor(redis: RedisClient, db: Client) {
        this.redis = redis;
        this.database = db;
    }

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
        let tokensPair =  {
            "accessToken": access,
            "refreshToken": refresh
        };
        this.redis.hmset(session_id, tokensPair);
    }

    deleteSession(session_id: string) {
        this.redis.del(session_id);
    }

}