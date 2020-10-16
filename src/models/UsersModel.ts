export interface UsersRepoI {
    getUserData(user_id: number): Promise<UserPublicData>;
}

type UserPublicData = {
    name: string
}

export class UsersModel {
    repo: UsersRepoI;
    constructor(repo: UsersRepoI) {
        this.repo = repo;
    }

    async getUserData(user_id: number): Promise<UserPublicData> {
        return this.repo.getUserData(user_id);
    }
}