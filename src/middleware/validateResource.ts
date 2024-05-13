import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import ErrorResponse from '../responses/ErrorResponse'

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedObject = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })

      if (schema.shape.body) req.body = parsedObject.body
      if (schema.shape.query) req.query = parsedObject.query
      if (schema.shape.params) req.params = parsedObject.params

      next()
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(q => ({
          message: q.message,
          keys: q.path
        }))
        // const errors = error.errors.map(q => (q.message))
        throw new ErrorResponse(400, 'Validation Error', errors)
      }
      return res.status(500).send({ errors: error })
    }
  }

export default validate
