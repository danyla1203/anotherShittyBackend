import {NotFoundErr} from "../lib/Error";

export interface ArticleRepositoryI {
    findArticle(article_id: number): any;
}

export class ArticleModel {
    repository: ArticleRepositoryI;

    constructor(repo: ArticleRepositoryI) {
        this.repository = repo
    }

    findArticle(article_id: number): any {
        let article = this.repository.findArticle(article_id);
        if(article) {
            return article;
        } else {
            throw new NotFoundErr("Article not found")
        }
    }
    findUserArticles(user_id: number): any {

    }
}
