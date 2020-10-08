import {DatabaseError, InvalidData, NotFoundErr} from "../lib/Error";

export interface ArticleRepositoryI {
    findArticle(article_id: number): any;
    findUserArticles(user_id: number): any;
    appendArticle(articleData: IncomingArticleData): void;
    deleteArticle(article_id: number): void;
    updateArticle(article_id: number, title?: string, text?: string): void;
}

export type IncomingArticleData = {
    author_id: number;
    title?: string;
    text?: string;
}

export type UpdateArticleData = {
    author_id: number;
    article_id: number;
    title?: string;
    text?: string;
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
    appendArticle(articleData: IncomingArticleData) {
        if (!articleData.text) {
            throw new InvalidData("Text is missing");
        }
        if (!articleData.title) {
            throw  new InvalidData("Title is missing");
        }
        this.repository.appendArticle(articleData);
    }

    async deleteArticle(user_id: number, article_id: number) {
        let article = await this.repository.findArticle(article_id);
        if (article) {
            if (article.author_id == user_id) {
                this.repository.deleteArticle(article_id);
            } else {
                throw new InvalidData("User haven't such article");
            }
        } else {
            throw new NotFoundErr("Article not found");
        }
    }
    async updateArticle(articleData: UpdateArticleData) {
        let { article_id, author_id, title, text } = articleData;
        let article = await this.repository.findArticle(article_id);

        if (article) {
            if (article.author_id == author_id) {
                this.repository.updateArticle(article_id, title, text);
            } else {
                throw new InvalidData("User haven't such article");
            }
        } else {
            throw new NotFoundErr("Article not found");
        }
    }
}
