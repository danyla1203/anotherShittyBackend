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
            console.log(e.error);
            return null;
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
            console.log(e.error);
            return null;
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
}