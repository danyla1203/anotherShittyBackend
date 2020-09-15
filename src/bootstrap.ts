import {Application, Request, Response} from "express";

export class Bootstrap {
    controllers: any[];

    constructor(controllers: any[]) {
        this.controllers = controllers;
    }

    start(expressApp: Application) {

        expressApp.all("*", (req: Request, res: Response) => {

        })

    }
}