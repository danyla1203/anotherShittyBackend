type ControllerDependencies = {
    models: any
}

export function Controller(dependencies: ControllerDependencies) {
    return function (constructor: Function) {
        for (let modelName in dependencies.models) {
            constructor.prototype[modelName] = dependencies.models[modelName];
        }
    }
}