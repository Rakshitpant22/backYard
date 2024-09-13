/*The ApiError class is a custom error handler that enhances error management in applications by providing a structured and consistent way to handle errors.

Key Points:
•	Enhanced Error Information: Includes additional properties like statusCode, errors, and data for more detailed error reporting.
•	Standardized Responses: Ensures consistent error responses, making it easier for clients to handle errors predictably.
•	Improved Debugging: Provides stack traces for debugging, with an option for custom stack traces.
•	Custom Messages: Allows for tailored error messages specific to the application’s needs.
•	Consistent Management: Facilitates centralized error handling through middleware.

Overall, ApiError simplifies error handling, improves clarity in error responses, and aids in debugging and maintenance.*/


class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}