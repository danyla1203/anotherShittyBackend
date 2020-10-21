import {IncomingUserChangedData, UserPrivateData, UserRepoI} from "../models/UserModel";
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
    deleteUser(user_id: number) {
        try {
            this.db.query(`delete from users where user_id = '${user_id}'`);
        } catch (e) {
            throw new DatabaseError();
        }
    }

    async updateUser(user: IncomingUserChangedData, user_id: number) {
        try {
            let result = await this.db.query(
                "update users set name = $1, country = $2 where user_id = $3",
                [user.name, user.country, user_id]
            );
            return !!result;

        } catch (e) {
            throw new DatabaseError(e);
        }
    }
}