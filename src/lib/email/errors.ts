export class EmailError extends Error {
    constructor(message: string, cause: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}