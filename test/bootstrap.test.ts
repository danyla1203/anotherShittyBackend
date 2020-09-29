import { Request } from "express";
import {Bootstrap} from "../src/bootstrap";

const bootstrapTest = new Bootstrap([]);

test("handler", () => {
    let handlers = [
        {
            method: "POST",
            path: "/",
            handlerFunc: (req: Request) => {}
        },
        {
            method: "GET",
            path: "/",
            handlerFunc: (req: Request) => {}
        },
        {
            method: "GET",
            path: "/test/:id/:user_id",
            handlerFunc: (req: Request) => {}
        },
        {
            method: "POST",
            path: "/article/:path",
            handlerFunc: (req: Request) => {}
        }
    ];

    expect(bootstrapTest.getHandler("/", "POST", handlers)).toBe(handlers[0]);
    expect(bootstrapTest.getHandler("/article/12", "POST", handlers)).toBe(handlers[3]);
    expect(bootstrapTest.getHandler("/test/12/23", "GET", handlers)).toBe(handlers[2])
});
