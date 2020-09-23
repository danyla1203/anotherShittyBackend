interface AuthorizationRepositoryI {

}

export class AuthorizationModel {
    repository: AuthorizationRepositoryI;
    constructor(repo: AuthorizationRepositoryI) {
        this.repository = repo;
    }


}