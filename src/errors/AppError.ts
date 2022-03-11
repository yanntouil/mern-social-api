




export default class AppError extends Error {
    errorCode: number|undefined
    type: string
    constructor(...args: (string|number|{ errorCode: number|undefined })[]) {
        if (args[0] && typeof args[0] === 'string') {
            super(args[0])
            this.message = args[0]
        } else super()
        this.type = 'AppError'
        if (args[1]) {
            if (typeof args[1] === 'object') {
                if (args[1].errorCode) this.errorCode = args[1].errorCode
            } else if (typeof args[1] === 'number') {
                this.errorCode = args[1]
            }
        }
    }
}