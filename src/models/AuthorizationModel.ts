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

export type UserJwt = {
    user_id: number,
    name: string
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

    createAccessToken(user_id: number, userName: string) {
        let payload: UserJwt = {
            user_id: user_id,
            name: userName
        };
        return jwt.sign(payload, process.env.JWT_KEY || "test_key");
    }
    createRefreshToken(): string {
        return "";
    }

    getTokens(session_id: string, user_id: number, userName: string): string[] {
        let accessToken = this.createAccessToken(user_id, userName);
        let refreshToken = this.createRefreshToken();
        this.authRepository.setTokens(session_id, accessToken, refreshToken);
        return [ accessToken, refreshToken ];
    }

    createSession(ip: string, userAgent: string): string {
        let sessionId = this.createSeesionId(ip, userAgent);
        this.authRepository.createSession(sessionId);
        return sessionId;
    }

    async verifyUserLogin(userName: string, password: string): Promise<User> {
        if (!userName || !password) {
            throw new InvalidData("Incorrect user data");
        }
        let user: User | null = await this.authRepository.findUserFromDb(userName);

        if (user) {
            if (user.password != password) {
                throw new BadPassword();
            } else {
                return user;
            }
        } else {
            throw new NoSuchUser();
        }
    }

    checkAccessToken(token: string | undefined): UserJwt {
        if (!token) {
            throw new BadAccessToken("Access token is missing");
        }
        try {
            return jwt.verify<UserJwt>(token, process.env.JWT_KEY || "test_key");
        } catch (e) {
            throw new BadAccessToken("Access token is broken");
        }
    }

    destroySession(session_id: string) {
        this.authRepository.deleteSession(session_id);
    }
}