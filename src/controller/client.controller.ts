import { Request, Response } from 'express'
import { ClientInput, ParamInput, QueryInput } from '../schema/client.schema'
import {
  createClient,
  deleteClient,
  getAllClient,
  getSingleClient,
  getTotalCount,
  updateClient
} from '../service/client.service'
import asyncHandler from '../utils/asyncHandler'
import ApiResponse from '../responses/ApiResponse'
import ErrorResponse from '../responses/ErrorResponse'

export const getAllClientHandler = asyncHandler(
  async (req: Request<{}, {}, {}, QueryInput['query']>, res: Response) => {
    const { page = 1, limit = 3 } = req.query
    const offset = (page - 1) * limit
    const totalCount = await getTotalCount()

    const totalPages = Math.ceil(totalCount / limit)

    const user = await getAllClient(limit, offset)
    return res.json(
      new ApiResponse(
        { user, totalPages, page, limit },
        'Client fetched successfully',
        201
      )
    )
  }
)

export const getSingleClientHandler = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const user = await getSingleClient(req.params.id)
    if (!user) throw new ErrorResponse(404, 'Client Not Found')
    return res.json(
      new ApiResponse({ user }, 'Client fetched successfully', 201)
    )
  }
)

export const createClientHandler = asyncHandler(
  async (req: Request<{}, {}, ClientInput['body']>, res: Response) => {
    const user = await createClient(req.body)
    return res.json(
      new ApiResponse({ user }, 'Client created successfully', 201)
    )
  }
)
export const updateClientHandler = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const isPresent = await getSingleClient(req.params.id)
    if (!isPresent) throw new ErrorResponse(404, 'Client Not Found')
    const user = await updateClient(req.params.id, req.body)
    return res.json(
      new ApiResponse({ user }, 'Client updated successfully', 201)
    )
  }
)

export const deleteClientHandler = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const isPresent = await getSingleClient(req.params.id)
    if (!isPresent) throw new ErrorResponse(404, 'Client Not Found')
    await deleteClient(req.params.id)
    return res.json(new ApiResponse({}, 'Client Deleted successfully', 204))
  }
)
