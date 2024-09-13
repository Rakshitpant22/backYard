/*The ApiResponse class is used to standardize and structure API responses in a consistent format. This helps in ensuring that responses from your API are predictable and easier for clients to process. Here’s how it is typically used:
Key Features:
•	Standardized Format: Provides a consistent structure for API responses, which includes statusCode, data, message, and success.
•	Success Flag: Automatically sets the success property based on the statusCode, helping to indicate whether the request was successful or not.
*/

class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }