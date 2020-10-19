import {Request, Response} from "express";

import {ArticleModel} from "../models/ArticleModel";
import {Delete, get, post, put} from "../lib/httpMethodDecorators";
import {AuthorizationModel, UserJwt} from "../models/AuthorizationModel";

export class ArticleController {
    articleModel: ArticleModel;
    authModel: AuthorizationModel;

    constructor(articleModel: ArticleModel, authModel: AuthorizationModel) {
        this.articleModel = articleModel;
        this.authModel = authModel;
    }

    @get("/articles")
    async getAllArticles() {
        return this.articleModel.getArticles();
    }

    @get("/article/:article_id")
    article(req: Request) {
        let article_id: number = parseInt(req.params["article_id"]);
        let article = this.articleModel.findArticle(article_id);
        return article;
    }

    @get("/articles/:user_id")
    async userArticles(req: Request) {
        let user_id: number = parseInt(req.params["user_id"]);
        let articles = this.articleModel.findUserArticles(user_id);
        return articles;
    }

    @post("/add-article")
    async addArticle(req: Request) {
        let user: UserJwt = this.authModel.checkAccessToken(req.headers.authorization);
        let articleData = {
            author_id: user.user_id,
            title: req.body["title"],
            text: req.body["text"],
        };
        this.articleModel.appendArticle(articleData);
    }

    @Delete("/article/:article_id")
    deleteArticle(req: Request) {
        let user: UserJwt = this.authModel.checkAccessToken(req.headers.authorization);
        let article_id = parseInt(req.params["article_id"]);
        this.articleModel.deleteArticle(user.user_id, article_id);
    }

    @put("/article/:article_id")
    updateArticle(req: Request) {
        let user: UserJwt = this.authModel.checkAccessToken(req.headers.authorization);
        let articleData = {
            article_id: parseInt(req.params["article_id"]),
            author_id: user.user_id,
            title: req.body["title"],
            text: req.body["text"]
        };
        this.articleModel.updateArticle(articleData);
    }
}