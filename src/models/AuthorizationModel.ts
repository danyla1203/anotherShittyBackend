import {BadPassword, NoSuchUser} from "../lib/Error";

export interface AuthorizationRepositoryI {
    findUser(name: string): any
}

export class AuthorizationModel {
    authRepository: AuthorizationRepositoryI;

    constructor(repo: AuthorizationRepositoryI) {
        this.authRepository = repo;
    }

    verifyUserLogin(userName: string, password: string) {
        let user = this.authRepository.findUser(userName);
        if (user) {
            if (user.password == password) {
                //create session
            } else {
                throw new BadPassword()
            }

        } else {
            throw new NoSuchUser();
        }
    }
}