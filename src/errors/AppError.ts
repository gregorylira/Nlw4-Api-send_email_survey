

export class AppError{
    message:string;
    statusCode: Number;

    constructor(message: string, statusCode = 400){
        this.message = message
        this.statusCode = statusCode
    }
}