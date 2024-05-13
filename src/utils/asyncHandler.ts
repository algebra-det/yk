import { Request, Response, NextFunction } from 'express'
// const asyncHandler =
//   fn => (req: Request, res: Response, next: NextFunction) => {
//     try {
//       fn(req, res, next)
//     } catch (error) {
//       next(error)
//     }
//   }

const asyncHandler = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(err => {
      // console.log('Error Occured: ', err);
      next(err)
    })
  }
}

export default asyncHandler
