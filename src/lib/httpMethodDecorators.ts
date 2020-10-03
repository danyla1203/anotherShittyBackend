import "reflect-metadata";

export function get(path: string) {
    return function(
        target: any,
        methodName: string,
        funcDescriptor: any
    ) {
        let handler = {
            method: "GET",
            path: path,
            handlerFunc: funcDescriptor.value
        };
        Reflect.defineMetadata(path, handler, target);
    }
}
export function post(path: string) {
    return function(
        target: any,
        methodName: string,
        funcDescriptor: any
    ) {
        let handler = {
            method: "POST",
            path: path,
            handlerFunc: funcDescriptor.value
        };
        Reflect.defineMetadata(path, handler, target);
    }
}