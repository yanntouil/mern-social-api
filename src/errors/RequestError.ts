import AppError from "./AppError"




export default class RequestError extends AppError {
    statusCode: number|undefined
    constructor(...args: (string|number|{ errorCode: number|undefined, statusCode: number|undefined })[]) {
        super(...args)
        this.type = 'RequestError'
        if (args[1]) {
            if (typeof args[1] === 'number') {
                this.statusCode = args[1]
                delete(this.errorCode)
            } else if (typeof args[1] === 'object') {
                if (args[1].statusCode) this.statusCode = args[1].statusCode
            }
        }
    }
}