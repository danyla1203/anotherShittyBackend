export interface UserRepoI {
    getUser(user_id: number): Promise<UserPrivateData>
}

export type UserPrivateData = {
    name: string;
}

export class UserModel {
    repo: UserRepoI;
    constructor(repo: UserRepoI) {
        this.repo = repo;
    }

    async getPrivateUserData(user_id: number) {
        return this.repo.getUser(user_id);
    }

}