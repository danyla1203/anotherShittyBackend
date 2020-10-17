import {NotFoundErr} from "../lib/Error";

export interface UsersRepoI {
    getUserData(user_id: number): Promise<UserPublicData | null>;
    getUsersList(): Promise<UserPublicData[]>
}

export type UserPublicData = {
    name: string
}

export class UsersModel {
    repo: UsersRepoI;
    constructor(repo: UsersRepoI) {
        this.repo = repo;
    }

    async getUserData(user_id: number): Promise<UserPublicData> {
        let userData = await this.repo.getUserData(user_id);
        if (userData) {
            return userData;
        } else {
            throw new NotFoundErr("User not found");
        }
    }
    async getUsersList() {
        return this.repo.getUsersList();
    }
}