import {UserRepoI} from "../models/UserModel";
import {Client} from "pg";

export class UserRepository implements UserRepoI {
    db: Client;
    constructor(connection: Client) {
        this.db = connection;
    }
}