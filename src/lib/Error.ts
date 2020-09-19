type ErrorData = {
    statusCode: number,
    statusText: string,
}

export class CustomError extends Error{
    errorData: ErrorData;
    constructor(errData: ErrorData) {
        super();
        this.errorData = errData;
    }
}

export class NotFoundErr extends  CustomError {
    constructor() {
        super({ statusCode: 404, statusText: "Error 404" });
    }
}