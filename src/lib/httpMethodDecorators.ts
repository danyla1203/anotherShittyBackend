import "reflect-metadata";

export function get(path: string) {
    return function(
        target: any,
        methodName
    ) {
        let handler = {
            method: "GET",
            path: path,
            handlerName: methodName
        };
        Reflect.defineMetadata(path, handler, target);
    }
}
export function post(path: string) {
    return function(
        target: any,
        methodName: string
    ) {
        let handler = {
            method: "POST",
            path: path,
            handlerName: methodName
        }
    }
}