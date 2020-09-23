import {NotFoundErr} from "../lib/Error";

export interface ArticleRepositoryI {
    findArticle(article_id: number): any;
    findUserArticles(user_id: number): any;
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
        let articles = this.repository.findUserArticles(user_id);
        if (articles) {
            return articles;
        } else {
            throw new NotFoundErr("User haven't any articles");
        }
    }
}
