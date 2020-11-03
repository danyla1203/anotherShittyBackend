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
        Reflect.defineMetadata(`${path}|${methodName}`, handler, target);
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
        Reflect.defineMetadata(`${path}|${methodName}`, handler, target);
    }
}

export function Delete(path: string) {
    return function(
        target: any,
        methodName: string,
        funcDescriptor: any
    ) {
        let handler = {
            method: "DELETE",
            path: path,
            handlerFunc: funcDescriptor.value
        };
        Reflect.defineMetadata(`${path}|${methodName}`, handler, target);
    }
}

export function put(path: string) {
    return function(
        target: any,
        methodName: string,
        funcDescriptor: any
    ) {
        let handler = {
            method: "PUT",
            path: path,
            handlerFunc: funcDescriptor.value
        };
        Reflect.defineMetadata(`${path}|${methodName}`, handler, target);
    }
}

