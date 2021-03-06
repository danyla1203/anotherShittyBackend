import {UserModel} from "../models/UserModel";
import {Delete, get, put} from "../lib/httpMethodDecorators";
import {AuthorizationModel} from "../models/AuthorizationModel";
import {Request} from "express";

export class UserController {
    model: UserModel;
    authModel: AuthorizationModel;

    constructor(model: UserModel, authModel: AuthorizationModel) {
        this.model = model;
        this.authModel = authModel;
    }

    @get("/user")
    getUser(req: Request) {
        let token = req.headers.authorization;
        let user_id = this.authModel.checkAccessToken(token).user_id;
        return this.model.getPrivateUserData(user_id);
    }

    @put("/user")
    async updateUserData(req: Request) {
        const copyUserData = Object.assign({}, req.body);
        let token = req.headers.authorization;
        const user_id = this.authModel.checkAccessToken(token).user_id;

        let newUser = await this.model.updateUser(user_id, copyUserData);
        return { ok: true, user: newUser };
    }

    @Delete("/user")
    async deleteUser(req: Request) {
        let token = req.headers.authorization;
        let user_id = this.authModel.checkAccessToken(token).user_id;
        await this.model.deleteUser(user_id);
        return { ok: true };
    }

}