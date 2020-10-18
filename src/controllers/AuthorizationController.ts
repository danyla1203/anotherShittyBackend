import {Request, Response} from "express";

import {AuthorizationModel} from "../models/AuthorizationModel";
import {post} from "../lib/httpMethodDecorators";

export class AuthorizationController {
    authModel: AuthorizationModel;

    constructor(model: AuthorizationModel) {
         this.authModel = model;
    }

    @post("/login")
    async login(req: Request, res: Response) {
        let userName = req.body["name"];
        let password = req.body["password"];

        const userData = await this.authModel.verifyUserLogin(userName, password);
        let session_id = this.authModel.createSession(req.ip, req.headers["user-agent"] || "");
        let [ accessToken, refreshToken ] = this.authModel.getTokens(session_id, userData.user_id,  userData.name);

        res.cookie("s_id", session_id,  { httpOnly: true });
        res.cookie("refresh_token", refreshToken, {  maxAge: 9000000, httpOnly: true });
        return { accessToken: accessToken };
    }

    @post("/logout")
    async logout(req: Request) {
        await this.authModel.checkAccessToken(req.headers.authorization);
        this.authModel.destroySession(req.cookies["s_id"] || "");
        return { ok: true }
    }
}