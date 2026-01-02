// Custom Error Class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// API Response Type
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Success Response
export const successResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: true,
  message,
  data
})

// Error Response
export const errorResponse = (
  message: string,
  error?: string
): ApiResponse => ({
  success: false,
  message,
  error
})
