import * as http from "http";

export interface Request extends http.IncomingMessage {
    url: string;
    method: string
    params: any,
}