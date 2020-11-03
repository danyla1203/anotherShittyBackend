import {RedisClient} from "redis";
import {Client, QueryResult} from "pg";

import {AuthorizationRepositoryI} from "../models/AuthorizationModel";
import {DatabaseError} from "../lib/Error";

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
            let result: QueryResult = await this.database.query(`select * from users where name='${userName}'`);
            let user: User = result.rows[0];
            if (user) {
                return user;
            } else {
                return null;
            }
        } catch (e) {
            throw new DatabaseError();
        }
    }
    setTokens(session_id: string, access: string, refresh: string) {
        let tokensPair =  {
            "accessToken": access,
            "refreshToken": refresh
        };
        this.redis.hmset(`users_sessions:${session_id}`, tokensPair);
    }

    async insertUser(name: string, password: string, country: string) {
        try {
            let result = await this.database.query(
                "insert into users(name, password, country) values($1, $2, $3)",
                [name, password, country]
            );
            return result.rows[0];
        } catch (e) {
            throw new DatabaseError();
        }
    }

    deleteSession(session_id: string) {
        this.redis.del(session_id);
    }

}