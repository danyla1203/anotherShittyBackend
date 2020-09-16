import {Application, Request, Response} from "express";

type handler = {
    method: string,
    path: string,
    handleFunc: (req: Request) => any
}

export class Bootstrap {
    controllers: any[];

    constructor(controllers: any[]) {
        this.controllers = controllers;
    }

    getAllHandlersFromControllers(): handler[] {
        let handlers = [];
        for(let i = 0; i < this.controllers.length; i++) {
            let metaKeys = Reflect.getMetadataKeys(this.controllers[i]);
            for (let k = 0; k < metaKeys.length; k++) {
                let handler: handler = Reflect.getMetadata(metaKeys[k], this.controllers[i]);
                handler.handleFunc = handler.handleFunc.bind(this.controllers[k]);
                handlers.push(handler);
            }
        }
        return handlers;
    }

    getHandler(url: string, handlers: handler[]) {

    }

    start(expressApp: Application) {

        expressApp.all("*", (req: Request, res: Response) => {
            let handlers = this.getAllHandlersFromControllers();
            let url = req.url;
            let handler = this.getHandler(url, handlers);
        })

    }
}