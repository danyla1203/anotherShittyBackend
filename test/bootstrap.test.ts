import {Request, Response} from "express";
import {Bootstrap, handler} from "../src/bootstrap";
import {PostBody} from "../src/lib/PostBody";

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
        expect(bootstrapTest.getHandler("/", "POST", handlers)).toBe(handlers[2]);
        expect(bootstrapTest.getHandler("/articles", "GET", handlers)).toBe(handlers[1]);
    });
    test("test routs with pattern", () => {
        expect(bootstrapTest.getHandler("/article/12", "POST", handlers)).toBe(handlers[5]);
        expect(bootstrapTest.getHandler("/test/12/23", "GET", handlers)).toBe(handlers[4]);
        expect(bootstrapTest.getHandler("/articles/1", "GET", handlers)).toBe(handlers[0]);
    });
});
