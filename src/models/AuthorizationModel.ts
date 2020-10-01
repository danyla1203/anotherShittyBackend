import {BadPassword, NoSuchUser} from "../lib/Error";
import * as crypto from "crypto";

export interface AuthorizationRepositoryI {
    findUserFromDb(name: string): any
    createSession(session_id: string): void
    setTokens(session_id: string, access: string, refresh: string): void;
}

export class AuthorizationModel {
    authRepository: AuthorizationRepositoryI;

    constructor(repo: AuthorizationRepositoryI) {
        this.authRepository = repo;
    }

    createSeesionId(ip: string, userAgent: string): string {
        let session_id = crypto.createHash("sha256")
            .update(ip + userAgent)
            .digest("hex");
        return session_id
    }

    createAccesToken(userName: string): string {
        return ""
    }
    createRefreshToken(): string {
        return ""
    }

    getTokens(session_id: string, userName: string): string[] {
        let accessToken = this.createAccesToken(userName);
        let refreshToken = this.createRefreshToken();
        this.authRepository.setTokens(session_id, accessToken, refreshToken);
        return [ accessToken, refreshToken ];
    }

    createSession(ip: string, userAgent: string): string {
        let sessionId = this.createSeesionId(ip, userAgent);
        this.authRepository.createSession(sessionId);
        return sessionId;
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