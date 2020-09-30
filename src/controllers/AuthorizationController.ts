import {Request} from "express";

import {Controller} from "../lib/ControllerDecorator";
import {AuthorizationModel} from "../models/AuthorizationModel";
import {AuthorizationRepository} from "../repositories/AuthorizationRepository";
import {post} from "../lib/httpMethodDecorators";

@Controller({
    models: {
        "authModel": new AuthorizationModel(new AuthorizationRepository())
    }
})
export class AuthorizationController {
    authModel: AuthorizationModel;

    @post("/login")
    async login(req: Request) {
        let userName = req.body["name"];
        let password = req.body["password"];

        this.authModel.verifyUserLogin(userName, password);
        let session_id = this.authModel.createSession(req.ip, req.headers["user-agent"]);
        //TODO: get tokens and set they in cookies.
    }
}