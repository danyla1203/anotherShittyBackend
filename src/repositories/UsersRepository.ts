import {Client} from "pg";
import {UserPublicData, UsersRepoI} from "../models/UsersModel";

export class UsersRepository implements UsersRepoI{
    db: Client;
    constructor(connection: Client) {
        this.db = connection;
    }

    async getUserData(user_id: number): Promise<UserPublicData> {
        return {
            name: "John"
        }
    }
    async getUsersList(): Promise<UserPublicData[]> {
        return [];
    }
}