import {RedisClient} from "redis";
import {Client, QueryResult} from "pg";

import {AuthorizationRepositoryI} from "../models/AuthorizationModel";

export type User = {
    user_id: number;
    name: string,
    password: string
}

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

    async findUserFromDb(userName: string): Promise<User | null> {
        try {
            let result: QueryResult = await this.database.query(`select * from users where user_name='${userName}'`);
            let user: User = result.rows[0];
            if (user) {
                return user;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e.error);
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