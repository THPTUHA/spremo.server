export default class BaseError {

    static Code = {
        ERROR: -1,
        SUCCESS: 1,
        INVALID_PASSWORD: 2,
        INACTIVATE_AUTH: 3,
        NOTFOUND: 4,
        INVALID_AUTH: 5,
        INVALID_INPUT: 6 
    };

    message: string;
    code: number;
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }

    release() {
        return {
            message: this.message,
            code: this.code
        }
    }
}