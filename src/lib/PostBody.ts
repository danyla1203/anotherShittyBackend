import {Request} from "./Request";
import * as Busboy from "busboy";
import * as path from "path";
import * as fs from "fs";

export class PostBody {

    private async handleMultipart(req: Request) {
        let busboy = new Busboy({ headers: req.headers });
        let body = new Map();
        return new Promise((resolve) => {
            busboy.on('file', function(fieldName, file, fileName) {
                let saveTo = path.join("./uploaded_img", path.basename(fileName));
                fs.writeFile(saveTo, "", (err)=> {
                    if (err) throw  err;
                    file.pipe(fs.createWriteStream(saveTo));
                });
                body.set(fieldName, { fileName: fileName });
            });
            busboy.on('field', function(fieldName, val) {
                body.set(fieldName, val);
            });
            busboy.on('finish', function() {
                req.body = body;
                resolve();
            });
            req.pipe(busboy);
        })
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
        if (req.method != "POST" && req.method != "PUT") {
            return;
        }
        let contentType = req.headers["content-type"];
        if (!contentType) {
            return null;
        }

        switch (contentType.split(";")[0]) {
            case "multipart/form-data":
                await this.handleMultipart(req);
                break;
            case "application/x-www-form-urlencoded":
                await this.handleUrlencoded(req);
                break;
        }
    }
}