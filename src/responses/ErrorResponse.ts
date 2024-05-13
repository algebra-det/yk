class ErrorResponse extends Error {
  statusCode: number
  data: object | null
  message: string
  success: false
  errors?: string[] | undefined

  constructor(
    statusCode = 500,
    message = 'Something went wrong',
    errors: any[] = [],
    data = null,
    stack = ''
  ) {
    super(message)

    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.errors = errors
    this.success = false

    if (stack) this.stack = stack
    else Error.captureStackTrace(this, this.constructor)
  }
}

export default ErrorResponse
