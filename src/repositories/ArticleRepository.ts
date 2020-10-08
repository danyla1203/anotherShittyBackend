import {ArticleRepositoryI, IncomingArticleData} from "../models/ArticleModel";
import {Client} from "pg";
import {DatabaseError} from "../lib/Error";

type Article = {
    article_id: number;
    author_id: number
}

export class ArticleRepository implements ArticleRepositoryI {
    db: Client;
    constructor(db: Client) {
        this.db = db;
    }

    async findArticle(article_id: number): Promise<Article | null> {
        try {
            let result = await this.db.query(`select * from articles where article_id='${article_id}'`);
            let article: Article = result.rows[0];
            if (article) {
                return article;
            } else {
                return null;
            }
        } catch (e) {
            throw new DatabaseError()
        }
    }

    async findUserArticles(user_id: number) {
        try {
            let result = await this.db.query(`select * from articles where author_id='${user_id}'`);
            let articles: Article[] = result.rows[0];
            if (articles.length > 0) {
                return articles;
            } else {
                return null;
            }
        }
        catch (e) {
            throw new DatabaseError();
        }
    }
    async appendArticle(articleData: IncomingArticleData) {
        let { title, text, author_id } = articleData;
        try {
            let result = await this.db.query(
                "insert into articles (title, text, author_id) values($1, $2, $3)",
                [title, text, author_id]
            );
        } catch (e) {
            throw new DatabaseError();
        }
    }
    deleteArticle(article_id: number) {
        try {
            this.db.query(
                `delete * from articles where article_id='${article_id}'`
            );
        } catch (e) {
            throw new DatabaseError();
        }
    }
    updateArticle(article_id: number, title: string, text: string) {
        try {
            this.db.query(
                "update articles set title=$1, text=$2 where article_id=$3",
                [title, text, article_id]
            );
        } catch (e) {
            throw new DatabaseError();
        }
    }
}