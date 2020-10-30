import * as http from "http";
import {Request} from "./lib/Request";
import {Response} from "./lib/Response";
import * as fs from "fs";

type handler = {
    method: string,
    path: string,
    handlerFunc: (req?: Request, res?: Response) => any
}

export class Bootstrap {
    controllers: any[];

    constructor(controllers: any[]) {
        this.controllers = controllers;
    }

    getAllHandlersFromControllers(): handler[] {
        let handlers = [];
        for (let i = 0; i < this.controllers.length; i++) {
            let metaKeys = Reflect.getMetadataKeys(this.controllers[i]);

            for (let k = 0; k < metaKeys.length; k++) {
                let handler: handler = Reflect.getMetadata(metaKeys[k], this.controllers[i]);
                handler.handlerFunc = handler.handlerFunc.bind(this.controllers[i]);
                handlers.push(handler);
            }
        }
        return handlers;
    }

    setParamsFromUri(url: string, pattern: string, req: Request) {
        let splitedUrl = url.substring(1).split("/");
        let splitedPattern = pattern.substring(1).split("/");
        req.params = {};
        for (let i = 0; i < splitedPattern.length; i++) {
            if (splitedPattern[i][0] == ":") {
                let paramName = splitedPattern[i].substring(1);
                let value = splitedUrl[i].substring(0);
                req.params[paramName] = value;
            }
        }
    }

    getHandler(url: string, method: string, handlers: handler[]): handler | undefined {
        let splitedUrl = url.substring(1).split("/");
        for (let i = 0; i < handlers.length; i++) {
            if (method != handlers[i].method) {
                continue;
            }
            let splitedHandlerPath = handlers[i].path.substring(1).split("/");
            //if pattern and url have different lengths
            if (splitedHandlerPath.length != splitedUrl.length) {
                continue;
            }
            for (let k = 0; k < splitedUrl.length + 1; k++) {
                if (k == splitedUrl.length) {
                    return handlers[i];
                }
                if (splitedHandlerPath[k][0] == ":") { continue }
                if (splitedHandlerPath[k] != splitedUrl[k]) {
                    break;
                }
            }
        }
    }

    handlePost(req: Request) {
        return new Promise((resolve, reject) => {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => {
                req.body = new Map();
                data.split("&").map((keyValue) => {
                    let keyValArr = keyValue.split("=");
                    req.body.set(keyValArr[0], keyValArr[1]);
                });
                resolve();
            })
        })
    }

    start(app: http.Server) {
        let handlers: handler[] = this.getAllHandlersFromControllers();

        app.on("request", async (req: Request, res: Response) => {
            let url = req.url;
            let method = req.method;
            let handler: handler | undefined = this.getHandler(url, method, handlers);

            if (!handler) {
                res.statusCode = 404;
                res.end("<h1>Error 404!</h1>");
                return;
            }
            this.setParamsFromUri(url, handler.path, req);
            await this.handlePost(req);


            try {
                let result: any = await handler.handlerFunc(req, res);
                res.end(JSON.stringify(result));
            } catch (e) {
                res.statusCode = e.errorData.statusCode;
                res.end(JSON.stringify(e.errorData));
            }
        });
    }
}