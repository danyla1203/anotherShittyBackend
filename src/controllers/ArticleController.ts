import {Request, Response} from "express";

import {ArticleModel} from "../models/ArticleModel";
import {get, post} from "../lib/httpMethodDecorators";
import {AuthorizationModel} from "../models/AuthorizationModel";

export class ArticleController {
    articleModel: ArticleModel;
    authModel: AuthorizationModel;

    constructor(articleModel: ArticleModel, authModel: AuthorizationModel) {
        this.articleModel = articleModel;
        this.authModel = authModel;
    }

    @get("/article/:article_id")
    article(req: Request) {
        let article_id: number = parseInt(req.params["article_id"]);
        let article = this.articleModel.findArticle(article_id);
        return article;
    }

    @get("/articles/:user_id")
    async userArticles(req: Request) {
        let user_id: number = parseInt(req.params["article_id"]);
        let articles = this.articleModel.findUserArticles(user_id);
        return articles;
    }
    @post("/add-article")
    async addArticle(req: Request, res: Response) {

    }
}