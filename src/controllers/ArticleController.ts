import {Request} from "express";

import {ArticleModel} from "../models/ArticleModel";
import {get} from "../lib/httpMethodDecorators";

export class ArticleController {
    articleModel: ArticleModel;

    constructor(articleModel: ArticleModel) {
        this.articleModel = articleModel;
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

}