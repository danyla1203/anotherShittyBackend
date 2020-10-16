import {Client} from "pg";
import {UsersRepoI} from "../models/UsersModel";

export class UsersRepository implements UsersRepoI{
    db: Client;
    constructor(connection: Client) {
        this.db = connection;
    }

    async getUserData(user_id: number) {
        return {
            name: "John"
        }
    }
}