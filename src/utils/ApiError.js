class ApiError extends Error {
    constructor (
        statusCode,
        message = "Something went wrong in ApiError.js file .",
        errors = [],
        stack = ""
    ){
        super(message)
        this.errors = errors
        this.data = null
        this.statusCode = statusCode
        this.message = message
        this.success = false
        

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this , this.constructor)
        }
    }
}

export { ApiError }