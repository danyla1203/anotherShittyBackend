import {Request} from "./Request";

export class PostBody {

    private handleMultipart(req: Request) {

    }

    private async handleUrlencoded(req: Request) {
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

    public async handle(req: Request) {
        let contentType = req.headers["content-type"];
        switch (contentType) {
            case "multipart/form-data":
                await this.handleMultipart(req);
            case "application/x-www-form-urlencoded":
                await this.handleUrlencoded(req);
        }
    }
}