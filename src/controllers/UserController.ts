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

    }

    @put("/user")
    updateUserData() {

    }

    @Delete("/user")
    deleteUser() {

    }

}