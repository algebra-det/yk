import { Request, Response } from 'express'
import { ClientInput, ParamInput } from '../schema/client.schema'
import {
  createClient,
  deleteClient,
  getAllClient,
  getSingleClient,
  updateClient
} from '../service/client.service'
import asyncHandler from '../utils/asyncHandler'
import ApiResponse from '../responses/ApiResponse'
import ErrorResponse from '../responses/ErrorResponse'

export const getAllClientHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getAllClient()
    return res.json(
      new ApiResponse({ user }, 'Client fetched successfully', 201)
    )
  }
)

export const getSingleClientHandler = asyncHandler(
  async (req: Request<ParamInput['params']>, res: Response) => {
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
  async (req: Request<ParamInput['params']>, res: Response) => {
    const isPresent = await getSingleClient(req.params.id)
    if (!isPresent) throw new ErrorResponse(404, 'Client Not Found')
    const user = await updateClient(req.params.id, req.body)
    return res.json(
      new ApiResponse({ user }, 'Client updated successfully', 201)
    )
  }
)

export const deleteClientHandler = asyncHandler(
  async (req: Request<ParamInput['params']>, res: Response) => {
    const isPresent = await getSingleClient(req.params.id)
    if (!isPresent) throw new ErrorResponse(404, 'Client Not Found')
    await deleteClient(req.params.id)
    return res.json(new ApiResponse({}, 'Client Deleted successfully', 204))
  }
)
