import * as express from "express";
import { Bootstrap } from "./bootstrap";

const app = express();

const controllers = [

];
const boostrap = new Bootstrap(controllers);

boostrap.start(app);

app.listen(3000);