import {Application, Request, Response} from "express";

export class Bootstrap {
    controllers: any[];

    constructor(controllers: any[]) {
        this.controllers = controllers;
    }

    getAllHandlersFromControllers() {
        let handlers = [];
        for(let i = 0; i < this.controllers.length; i++) {
            let metaKeys = Reflect.getMetadataKeys(this.controllers[i]);
            for (let k = 0; k < metaKeys.length; k++) {
                handlers.push(Reflect.getMetadata(metaKeys[k], this.controllers[i]));
            }
        }
        return handlers;
    }

    start(expressApp: Application) {

        expressApp.all("*", (req: Request, res: Response) => {
            let handlers = this.getAllHandlersFromControllers();

        })

    }
}