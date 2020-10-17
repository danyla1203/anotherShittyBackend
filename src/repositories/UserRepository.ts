import {UserPrivateData, UserRepoI} from "../models/UserModel";
import {Client} from "pg";
import {DatabaseError} from "../lib/Error";

export class UserRepository implements UserRepoI {
    db: Client;
    constructor(connection: Client) {
        this.db = connection;
    }

    async getUser(user_id: number): Promise<UserPrivateData> {
        try {
            let result = await this.db.query(`select * from users where user_id = '${user_id}' `);
            let user: UserPrivateData = result.rows[0];
            return user;
        } catch (e) {
            throw  new DatabaseError();
        }
    }
}