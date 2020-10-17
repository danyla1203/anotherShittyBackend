import {get} from "../lib/httpMethodDecorators";
import {Request} from "express";
import {UsersModel} from "../models/UsersModel";

export class UsersController {
    model: UsersModel;
    constructor(model: UsersModel) {
        this.model = model;
    }

    @get("/user/:user_id")
    async getUserData(req: Request) {
        let user_id = parseInt(req.params["article_id"]);
        let userData = await this.model.getUserData(user_id);
        return userData;
    }

    @get("/users/list")
    async getUsersList() {
        return this.model.getUsersList();
    }

}   