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
import {
  addToElastic,
  deleteSingleFromElastic,
  getMatchingFromElastic,
  updateInElastic
} from '../elastic/methods'

export const getAllClientHandler = asyncHandler(
  async (req: Request<{}, {}, {}, QueryInput['query']>, res: Response) => {
    const { page = 1, limit = 20, q = '', query = '' } = req.query
    const offset = (page - 1) * limit
    let data: Record<string, any> = {}
    if (!q) {
      // MySQL Search : Based on 'query' query
      const totalCount = await getTotalCount(query)
      const totalPages = Math.ceil(totalCount / limit)
      const clients = await getAllClient(limit, offset, query)
      data = { clients, totalPages, page, limit }
    } else {
      // Elastic Search : Based on 'q' query
      if (q.length <= 2)
        throw new ErrorResponse(400, 'Search with atleast 3 keywords')

      const results = await getMatchingFromElastic(q)
      const totalCount =
        typeof results.hits.total === 'object'
          ? results.hits.total.value
          : results.hits.total
      const clients = results.hits.hits.map(q => q._source)
      data = { clients, totalCount }
    }
    return res.json(new ApiResponse(data, 'Client fetched successfully', 201))
  }
)

export const getSingleClientHandler = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const client = await getSingleClient(req.params.id)
    if (!client) throw new ErrorResponse(404, 'Client Not Found')
    return res.json(
      new ApiResponse({ client }, 'Client fetched successfully', 201)
    )
  }
)

export const createClientHandler = asyncHandler(
  async (req: Request<{}, {}, ClientInput['body']>, res: Response) => {
    const client = await createClient(req.body)
    addToElastic(client)
    return res.json(
      new ApiResponse({ client }, 'Client created successfully', 201)
    )
  }
)
export const updateClientHandler = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const isPresent = await getSingleClient(req.params.id)
    if (!isPresent) throw new ErrorResponse(404, 'Client Not Found')
    if (!Object.keys(req.body).length)
      throw new ErrorResponse(404, 'No Data provided for update')
    const client = await updateClient(req.params.id, req.body)
    updateInElastic(client)
    return res.json(
      new ApiResponse({ client }, 'Client updated successfully', 201)
    )
  }
)

export const deleteClientHandler = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const isPresent = await getSingleClient(req.params.id)
    if (!isPresent) throw new ErrorResponse(404, 'Client Not Found')
    await deleteClient(req.params.id)
    deleteSingleFromElastic(req.params.id)
    return res.json(new ApiResponse({}, 'Client Deleted successfully', 204))
  }
)
