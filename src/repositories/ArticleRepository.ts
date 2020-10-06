import {ArticleRepositoryI} from "../models/ArticleModel";
import {Client} from "pg";

type Article = {
    article_id: number;
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
                return article
            } else {
                return null
            }
        } catch (e) {
            console.log(e.error);
            return null;
        }
    }

    findUserArticles(user_id: number) {
        return null;
    }
}