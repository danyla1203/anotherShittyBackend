import {BadPassword, NoSuchUser} from "../lib/Error";

export interface AuthorizationRepositoryI {
    findUserFromDb(name: string): any
    createSession(ip: string, userAgent: string): string
}

export class AuthorizationModel {
    authRepository: AuthorizationRepositoryI;

    constructor(repo: AuthorizationRepositoryI) {
        this.authRepository = repo;
    }

    createSession(ip: string, userAgent: string): string {
        return this.authRepository.createSession(ip, userAgent);
    }

    async verifyUserLogin(userName: string, password: string) {
        let user = await this.authRepository.findUserFromDb(userName);
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