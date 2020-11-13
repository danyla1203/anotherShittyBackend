import {Bootstrap, handler} from "../src/bootstrap";
import {PostBody} from "../src/lib/PostBody";
import * as mock from "mock-http";

const bootstrapTest = new Bootstrap([], new PostBody());
describe("testing get handler func", () => {
    let handlerFunc = jest.fn();
    let handlers: handler[] = [
        {
            method: "GET",
            path: "/articles/:user_id",
            handlerFunc: handlerFunc
        },
        {
            method: "GET",
            path: "/articles",
            handlerFunc: handlerFunc
        },
        {
            method: "GET",
            path: "/",
            handlerFunc: handlerFunc
        },
        {
            method: "GET",
            path: "/test/:id/:user_id",
            handlerFunc: handlerFunc
        },
        {
            method: "POST",
            path: "/article/:path",
            handlerFunc: handlerFunc
        }
    ];
    test("test simple rout", () => {
        expect(bootstrapTest.getHandler("/", "GET", handlers)).toBe(handlers[2]);
        expect(bootstrapTest.getHandler("/articles", "GET", handlers)).toBe(handlers[1]);
    });
    test("test routs with pattern", () => {
        expect(bootstrapTest.getHandler("/article/12", "POST", handlers)).toBe(handlers[4]);
        expect(bootstrapTest.getHandler("/test/12/23", "GET", handlers)).toBe(handlers[3]);
        expect(bootstrapTest.getHandler("/articles/1", "GET", handlers)).toBe(handlers[0]);
    });
});

describe("testing set params func", () => {
    let request = new mock.Request();
    test("test without pattern", () => {
        request.url = "/";
        request.method = "GET";
        bootstrapTest.setParamsFromUri(request.url, "/", request);
        expect(request.params).toStrictEqual({});

        request.method = "POST";
        bootstrapTest.setParamsFromUri(request.url, "/", request);
        expect(request.params).toStrictEqual({});
    });
    test("test with pattern", () => {
        request.url = "/articles/12";
        request.method = "GET";
        bootstrapTest.setParamsFromUri(request.url, "/articles/:article_id", request);
        expect(request.params).toStrictEqual({"article_id": "12"});

        request.url = "/test/1/2";
        bootstrapTest.setParamsFromUri(request.url, "/test/:var1/:var2", request);
        expect(request.params).toStrictEqual({"var1": "1", "var2": "2"});
    })

});
