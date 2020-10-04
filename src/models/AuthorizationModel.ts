import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import {BadAccessToken, BadPassword, InvalidData, NoSuchUser} from "../lib/Error";
import {User} from "../repositories/AuthorizationRepository";

export interface AuthorizationRepositoryI {
    findUserFromDb(name: string): Promise<User | null>;
    createSession(session_id: string): void;
    setTokens(session_id: string, access: string, refresh: string): void;
    deleteSession(session_id: string): void;
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
        return session_id;
    }

    createAccesToken(userName: string): string {
        return jwt.sign({ userName: userName }, process.env.JWT_KEY || "test_key");
    }
    createRefreshToken(): string {
        return "";
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
        if (!userName || !password) {
            throw new InvalidData("Incorrect user data");
        }
        let user: User | null = await this.authRepository.findUserFromDb(userName);

        if (user) {
            if (user.password != password) {
                throw new BadPassword();
            }
        } else {
            throw new NoSuchUser();
        }
    }

    checkAccessToken(token: string) {
        try {
            jwt.verify(token, process.env.JWT_KEY || "test_key");
        } catch (e) {
            throw new BadAccessToken("Access token is broken");
        }
    }

    destroySession(session_id: string) {
        this.authRepository.deleteSession(session_id);
    }
}