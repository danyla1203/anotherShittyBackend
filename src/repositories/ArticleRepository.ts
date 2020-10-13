import {ArticleRepositoryI, IncomingArticleData} from "../models/ArticleModel";
import {Client} from "pg";
import {DatabaseError} from "../lib/Error";
import {RedisClient} from "redis";

type Article = {
    article_id: number;
    author_id: number
}

export class ArticleRepository implements ArticleRepositoryI {
    db: Client;
    redis: RedisClient;
    constructor(db: Client, redis: RedisClient) {
        this.db = db;
        this.redis = redis;
    }

    async findArticle(article_id: number): Promise<Article | null> {
        try {
            let articleFromCache = await this.redis.hgetall(article_id + "");
            if (articleFromCache) {
                return articleFromCache;
            }

            let resultFromDb = await this.db.query(`select * from articles where article_id='${article_id}'`);
            let article: Article = resultFromDb.rows[0];
            if (article) {
                this.redis.hmset(article_id + "", article);
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
            this.redis.hmset(result.rows[0].article_id, result.rows[0]);
        } catch (e) {
            throw new DatabaseError();
        }
    }
    deleteArticle(article_id: number) {
        try {
            this.db.query(
                `delete * from articles where article_id='${article_id}'`
            );
            this.redis.del(article_id + "");
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