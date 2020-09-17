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
                handler.handlerFunc = handler.handlerFunc.bind(this.controllers[k]);
                handlers.push(handler);
            }
        }
        return handlers;
    }

    getHandler(url: string, handlers: handler[]): handler {
        let splitedUrl = url.substring(1).split("/");

        for (let i = 0; i < handlers.length; i++) {
            let splitedHandlerPath = handlers[i].path.substring(1).split("/");

            for (let k = 0; k < splitedUrl.length; k++) {
                if (splitedHandlerPath[k][0] == ":") {
                    //TODO: push var name and value to request object
                    continue;
                }
                if (splitedHandlerPath[k] != splitedUrl[k]) {
                    break;
                }
                //on last iteration
                if (k == splitedUrl.length - 1) {
                    return handlers[i];
                }
            }
        }
    }

    start(expressApp: Application) {

        expressApp.all("*", (req: Request, res: Response) => {
            let handlers: handler[] = this.getAllHandlersFromControllers();
            let url = req.url;
            let handler: handler = this.getHandler(url, handlers);
        })

    }
}