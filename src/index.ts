import * as express from "express";
import { Bootstrap } from "./bootstrap";

const app = express();

const controllers = [

];
const bootstrap = new Bootstrap(controllers);

bootstrap.start(app);

app.listen(3000);