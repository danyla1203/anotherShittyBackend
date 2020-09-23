import * as multer from "multer";
import * as express from "express";

import {Application, Request, Response} from "express";

type handler = {
    method: string,
    path: string,
    handlerFunc: (req: Request) => any
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
            if (method !== handlers[i].method) {
                continue;
            }
            let splitedHandlerPath = handlers[i].path.substring(1).split("/");
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

    start(expressApp: Application) {
        let handlers: handler[] = this.getAllHandlersFromControllers();
        const uploads = multer();

        expressApp.use(express.json());
        expressApp.use(express.urlencoded({ extended: true }));
        expressApp.use(uploads.array());

        expressApp.all("*", (req: Request, res: Response) => {
            let url = req.url;
            let method = req.method;
            let handler: handler | undefined = this.getHandler(url, method, handlers);

            if (typeof handler == "undefined") {
                res.status(404).send("<h1>Error 404</h1>");
                return;
            }
            this.setParamsFromUri(url, handler.path, req);

            try {
                let result: any = handler.handlerFunc(req);
                res.json(result);
            } catch (e) {
                res.json(e.errorData);
            }
        })
    }
}