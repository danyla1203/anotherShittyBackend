import {InvalidData} from "../lib/Error";

export interface UserRepoI {
    getUser(user_id: number): Promise<UserPrivateData>;
    deleteUser(user_id: number): void;
    updateUser(user: IncomingUserChangedData, user_id: number): Promise<boolean>;
}

export type UserPrivateData = {
    name: string;
}

export type IncomingUserChangedData = {
    name?: string;
    country?: string;
}

export class UserModel {
    repo: UserRepoI;
    constructor(repo: UserRepoI) {
        this.repo = repo;
    }

    private checkUserChangedData(name: string | undefined, country: string | undefined): boolean {
        if (!name || !country) {
            return false;
        }
        if (name.length < 3 || country.length < 3) {
            return false;
        }
        return true;
    }

    async getPrivateUserData(user_id: number) {
        return this.repo.getUser(user_id);
    }
    async deleteUser(user_id: number) {
        this.repo.deleteUser(user_id);
    }

    async updateUser(user_id: number, user: IncomingUserChangedData) {
        if (this.checkUserChangedData(user.name, user.country)) {
            await this.repo.updateUser(user, user_id);
            return user;
        } else {
            throw new InvalidData("User data is incorrect");
        }
    }

}