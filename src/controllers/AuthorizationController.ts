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

    @post("/signup")
    async signup(req: Request, res: Response) {
        let name = req.body["name"];
        let password = req.body["password"];
        let country = req.body["country"];

        //check data and create new user in db
        await this.authModel.checkData(name, password, country);
        await this.authModel.isUserExist(name);
        let user_id: number = await this.authModel.createUser(name, password, country);

        //get tokens and session_id
        let session_id: string = this.authModel.createSession(req.ip, req.headers["user-agent"] || "");
        const [ access, refresh ] = this.authModel.getTokens(session_id, user_id,  name);

        //send tokens and sess id
        res.cookie("s_id", session_id,  { httpOnly: true });
        res.cookie("refresh_token", refresh, {  maxAge: 9000000, httpOnly: true });
        return { accessToken: access };

    }
}