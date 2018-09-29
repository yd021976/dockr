export enum errorType {
    unknown,
    notAuthenticated,
    sessionExpired,
    backendError
}

export class AppError {
    public type: errorType;
    public message: string;
    public source: any;

    constructor(message: string, type: errorType = errorType.unknown, source: any = null) {
        this.type = type;
        this.message = message;
        this.source = source;
    }
}