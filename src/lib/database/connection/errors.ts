export class DatabaseError extends Error {
    constructor(message: string, cause: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}

export class SelectionError extends Error {
    constructor(message: string, cause: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}

export class InsertionError extends Error {
    constructor(message: string, cause: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}

export class DeletionError extends Error {
    constructor(message: string, cause: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}

export class UpdateError extends Error {
    constructor(message: string, cause: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}