import {BadPassword, NoSuchUser} from "../lib/Error";

export interface AuthorizationRepositoryI {
    findUserFromDb(name: string): any

}

export class AuthorizationModel {
    authRepository: AuthorizationRepositoryI;

    constructor(repo: AuthorizationRepositoryI) {
        this.authRepository = repo;
    }

    verifyUserLogin(userName: string, password: string) {
        let user = this.authRepository.findUserFromDb(userName);
        if (user) {
            if (user.password == password) {
                return true;
            } else {
                throw new BadPassword()
            }

        } else {
            throw new NoSuchUser();
        }
    }
}