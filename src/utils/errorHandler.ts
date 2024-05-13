import { Express, Request, Response, NextFunction } from 'express'
import ErrorResponse from '../responses/ErrorResponse'
import logger from './logger'

const errorHandler = (app: Express) => {
  app.use(
    (
      error: ErrorResponse | Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      let status = 500
      let response: Record<string, unknown> = {
        statusCode: status,
        message: error.message || 'Internal Server Error',
        success: false,
        stack: status === 500 ? error.stack : ''
      }
      logger.error(error.message)
      if (error instanceof ErrorResponse) {
        status = error?.statusCode || 500
        response.statusCode = status
        response.statusCode = status
        response.data = error.data
        response.errors = error.errors
      } else {
        response.errors = error
      }
      return res.status(status).json(response)
    }
  )
}

export default errorHandler
