import {Request} from "express";

import {ArticleModel} from "../models/ArticleModel";
import {get} from "../lib/httpMethodDecorators";
import {ArticleRepository} from "../repositories/ArticleRepository";
import {Controller} from "../lib/ControllerDecorator";

@Controller({
    models: {
        "articleModel": new ArticleModel(new ArticleRepository()),
    }
})
export class ArticleController {
    articleModel: ArticleModel;

    @get("/article/:article_id")
    article(req: Request) {
        let article_id: number = parseInt(req.params["article_id"]);

        let article = this.articleModel.findArticle(article_id);
        return article
    }

    @get("/articles/:user_id")
    userArticles(req: Request) {
        let user_id: number = parseInt(req.params["article_id"]);

        let articles = this.articleModel.findUserArticles(user_id);
        return articles;
    }

}