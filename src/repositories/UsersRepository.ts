import {Client} from "pg";
import {UserPublicData, UsersRepoI} from "../models/UsersModel";
import {DatabaseError} from "../lib/Error";

export class UsersRepository implements UsersRepoI{
    db: Client;
    constructor(connection: Client) {
        this.db = connection;
    }

    async getUserData(user_id: number): Promise<UserPublicData | null> {
        try {
            let result = await this.db.query(
                `select name, country from users where user_id = $1`,
                [ user_id ]
            );
            let user: UserPublicData | null = result.rows[0];
            return user;
        } catch (e) {
            throw new DatabaseError();
        }
    }
    async getUsersList(): Promise<UserPublicData[]> {
        try {
            let result = await this.db.query("select name, country from users");
            let users = result.rows;
            return users;
        } catch (e) {
            throw new DatabaseError();
        }
    }
}