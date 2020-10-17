export interface UserRepoI {

}

export class UserModel {
    repo: UserRepoI;
    constructor(repo: UserRepoI) {
        this.repo = repo;
    }

}